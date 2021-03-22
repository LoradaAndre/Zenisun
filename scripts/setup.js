

	/** to convert error code to human readable strings */
    var minor_default_string = {
        200	: "ok",
        404	: "Unknow command",
        601	: "Invalid parameter",
        602	: "Homing not completed",
        666	: "Error",
    };
                        
        // globals monitoring vars
    var monitoring_VDC1, monitoring_VDC2, monitoring_temp;	// power supply voltage (mV) and board temperature(1/10 degree)
    var monitoring_GPO_I = new Array();						// current General Purpose Outputs (GPO) current (mA)
    var monitoring_GPO_PWM = new Array();					// current General Purpose Outputs (GPO) outputs pwm ratio (0..255 count)
    var monitoring_GPI_V = new Array();						// current General Purpose Inputs  (GPI) inputs voltage (mV)
    var raw_motor_position = new Array();					// current motors position ( 0..motor_max_count )
    var raw_motor_max_count = [ 500, 500 ];					// max motors count position ( 0..motor_max_count )
    var raw_motor_flag = [0, 0];							// motors status : HOMING, CURRENT_DEF, RAIN
    var monitoring_sun = 0;									// current sun elevation (degree)
    var monitoring_date = 0;								// current pergola date, in seconds since 1/1/1970 ( JS/1000 format )
    var monitoring_user_config = 0;							// current user configuration :b0=rain mode, b1=sun track, b2=winter mode.
    var slider_auto_update = 0;								// 0 = user currently move slider : disable auto sliders position update
    var pergola_orient = 0;									// pergola orientation read back, 180 = full south oriented. 
    var pergola_drying = 0;									// shader dying angle after rain.
    var pergola_longitude = 0;								// pergola longitude user setting read back
    var pergola_latitude =  0;								// pergola latitude user setting read back
    var shader_close_treshold = 0;							// min elevation to automatically close shaders if sun tracking enabled
    var	ligt_on_h = 1200;									// automatically power on light at XX:xx
    var	ligt_off_h = 360;									// automatically power off light at XX:xx
    var my_current_config_ID = 0;							// readback automatum config ID
    var	board_version = 0;									// fill cpu board version
    var	board_rds = 0;										// fill cpu board mos rds on
    var	board_rth = 0;										// fill cpu board mos rth
    var	board_mot_fs = 0;									// fill cpu board mos motor FS
    var	board_led_fs = 0;									// fill cpu board mos LEDs FS
    var led6 ="";											// get text in html document for LED6 to dynamically enqueue power
    var led7 ="";											// get text in html document for LED7 to dynamically enqueue power
    var led11 ="";											// get text in html document for LED RGB to dynamically enqueue power
    var mem0_pwm = [ 0, 0, 0, 0, 0, 0, 0, 0];				// memory for 8 light pwm : PWM[4 .. 11] = dummy, dymmy, White1, white2, Red, green, blue, RVB dimming.
    var hwcfg = 0;											// populated equipements : motors & lights
    var automatum_list = [];								// minimum : allow to access to 1 automatum
    var my_current_automatum_cmd = "";						// suffix command for automatum selection "ID=n", default : no automatum selected/no suffix command
    var my_current_automatum_idx = 0;						// index of 4 adressable automatum currently adressed = {0, 1, 2, 3}
    var my_automatum_raw_data_array = new Array();			// store data for each automatum to accelerate automatum scitch HMI
    var my_automatum_raw_scan_array = new Array();			// store get_scan_resul() for each automatum to accelerate automatum scitch HMI
    var my_automatum_raw_configuration_array = new Array();	// store configuration for each automatum to accelerate automatum scitch HMI
    var pick_color_rgb = 0;									// 0 : roue chromatique, 1 = RVB slidebard
    var light_opt = 0;										// led pwm dimmer period : 0=0s, 1=1s, 2=2s, 3=4s
    var slider_light_inited = 0;							// toggle to 1 when callback added
    
        // global configuration for manufacturer
    var motor_configuration = new Array();					// motors settings.
    
	// start-up function for manufacturer settings page
function startup_setup()
{
    
    $("[id^=hwcfg_b").click(function(){
            var mask = 0;
            if ( $('#hwcfg_b0').is(':checked') ) mask |= 1;
            if ( $('#hwcfg_b1').is(':checked') ) mask |= 2;
            if ( $('#hwcfg_b2').is(':checked') ) mask |= 4;
            if ( $('#hwcfg_b3').is(':checked') ) mask |= 8;
            if ( $('#hwcfg_b4').is(':checked') ) mask |= 16;
            if ( $('#hwcfg_b5').is(':checked') ) mask |= 32;
//v1.20		 if ( $('#hwcfg_b6').is(':checked') ) mask |= 64;
        var command = '../cgi/zns.cgi?cmd=f&p=49&v=' + mask+my_current_automatum_cmd;
        $.ajax({
            url: command,	
            context: document.body
        }).done( function(data) {
            parse_command_ret(data);
        }).fail(  function( jqXHR, textStatus, errorThrown ) {
            parse_command_error(jqXHR, textStatus, errorThrown);
        });

    });
    
//	$('#unpairing_en').on('change', function() {
//		set_unpairing( $('#unpairing_en').val() );
//	});
    
    $("#automatum_sel").change(function() {
        my_current_automatum_idx = $("#automatum_sel :radio:checked").val();
        my_current_automatum_cmd = '&ID='+my_current_automatum_idx;
//		alert("selection change : " + my_current_automatum_cmd );
        restartup_setup();
    }); 
    
    
    slider_auto_update = 0;
        // start AJAX Updater
    setTimeout("periodic_update_1s()", 1000);
    
    restartup_setup();
}

    
	// start/restart setup function for manufacturer settings page
function restartup_setup()
{
//	var password = prompt("Please enter password", "xxxx");
	$(".atm0").hide();
	$(".atm1").hide();
	$(".atm2").hide();
	$(".atm3").hide();

		// get actual configuration
	$.ajax({
	  url: '../cgi/zns.cgi?cmd=c'+my_current_automatum_cmd,	
	  context: document.body
	}).done(function(data) {
	  parse_configuration(data);
//	  $('#longitude_entry').val( pergola_longitude );
//	  $('#latitude_entry').val( pergola_latitude );
	  fill_user_entry();
	}).fail(  function( jqXHR, textStatus, errorThrown ) {
		parse_command_error(jqXHR, textStatus, errorThrown);
	});
	
	
	slider_auto_update = 0;
}



// par ajax command return code, display error message if error code.
function parse_command_ret(data)
{
    if ( data == null )
    {
        $( "#messagebox_msg").html('<br/>' + "not connected" + '<br/>');
        $( "#messagebox" ).popup( "open" );
        return;
    }
    var ret_code = getXMLValue( data, 'retcode' );
    if ( ret_code != '200' )
    {
        var str_error = 'Error #' + ret_code;
        if ( minor_default_string[ret_code]	)
            str_error += ' : ' +  minor_default_string[ret_code];
        alert(str_error)
    }
    else
    {
//		$( "#messagebox_msg").html("<br/>Operation success<br/>");
//		$( "#messagebox" ).popup( "open" )
    }
}
    
function parse_command_error(jqXHR, textStatus, errorThrown)
{
    alert("Déconnecté")
    // $( "#messagebox_msg").html('<br/>' + "Déconnecté" + '<br/>');
    // $( "#messagebox" ).popup( "open" );
    return;
}

    	/** periodic status request, and update gui */
function periodic_update_1s()
{
	$.ajax({
	  url: "../cgi/zns.cgi?cmd=d&p=ios"+my_current_automatum_cmd,
	  context: document.body
	}).done(function(data) {
		parse_general_status(data);
	}).always( function(event) {
				// call again update
			setTimeout("periodic_update_1s()", 500);
	}).fail(  function( jqXHR, textStatus, errorThrown ) {
		parse_periodic_update_error(jqXHR, textStatus, errorThrown);
	});		
}


/** getback pergola configuration : one at startup */
function parse_configuration(data)
{
    if ( data == null )
    {   console.log("oui data est null")
        toggle_led_connected(false);
        return;
    }
    var ret_code = getXMLValue( data, 'retcode' );
    if ( ret_code == '500' )
        return;
    
    my_current_config_ID = getXMLValue( data, 'ID' );
    for ( idx = 0; idx < 2 ; idx ++)
    {
        motor_pack = getXMLValue( data, 'Mot'+idx );
        motor_cfg = motor_pack.split(";");
        console.log(motor_cfg)
        if ( motor_cfg.length > 0)
        {
            motor_configuration[idx] = {
                pit_kp:  motor_cfg[0],
                pit_ki:  motor_cfg[1],
                pit_kt:  motor_cfg[2],
                motor_max_count: motor_cfg[3],
                max_current_mAmps: motor_cfg[4],
                max_angle_degree: motor_cfg[5],
                max_current_mAmps_h: motor_cfg[6],
                max_speed_h: motor_cfg[7],
                max_speed_n: motor_cfg[8], // v1.8+
                h_current_offset: motor_cfg[9],
                h_switch_offset: motor_cfg[10],
                zero_degree_offset: motor_cfg[11],
                delta_setpoint_h: motor_cfg[12], // v1.8+
                delta_setpoint_n: motor_cfg[13], // v1.8+
            };
        }
    }
    pergola_orient = getXMLValue( data, 'orient' );	// fill pergola orientation manufacturer field
    pergola_drying = getXMLValue( data, 'drying' );	// fill pergola post rain shades drying angle
    pergola_longitude = getXMLValue( data, 'lon' )/100.0;	// fill pergola longitude user field
    pergola_latitude = getXMLValue( data, 'lat' )/100.0;	// fill pergola longitude user field
    board_version = getXMLValue( data, 'board' );	// fill cpu board version
    board_rds = getXMLValue( data, 'rds' );	// fill cpu board mos rds on
    board_rth = getXMLValue( data, 'rth' );	// fill cpu board mos rth
    board_mot_fs = getXMLValue( data, 'mot_fs' );	// fill cpu board mos motor FS
    board_led_fs = getXMLValue( data, 'led_fs' );	// fill cpu board mos LEDs FS
    
        // fw v1.8+
    shader_close_treshold = getXMLValue( data, 'sun_elev_close' );	// auto close if sun elevation < this.
    ligt_on_h = getXMLValue( data, 'ligt_on_h' );	// auto light on at this time
    ligt_off_h = getXMLValue( data, 'ligt_off_h' );	// auto light on at this time
    
        // fw v1.10+
    hwcfg = getXMLValue( data, 'hwcfg' );	// populated accessories
    $("#hwcfg_b0").prop('checked', hwcfg&1);
    $("#hwcfg_b1").prop('checked', hwcfg&2);
    $("#hwcfg_b2").prop('checked', hwcfg&4);
    $("#hwcfg_b3").prop('checked', hwcfg&8);
    $("#hwcfg_b4").prop('checked', hwcfg&16);
    $("#hwcfg_b5").prop('checked', hwcfg&32);
//v1.20	$("#hwcfg_b6").prop('checked', hwcfg&64).checkboxradio('refresh');
    
        // fw v1.16+ : get list of automatums accessibles via this interface : eg <automatums>0;2;3</automatums> allow acces to automatum #0, #2 and #3
    if ( automatum_list.length == 0 )	
    {
        automatum_list = getXMLValue( data, 'automatums' ).split(";");
        my_current_automatum_idx = 0;
        my_current_automatum_cmd = '&ID='+my_current_automatum_idx;
    }
    
    if ( ( automatum_list.length > 1 ) || ( automatum_list[0] != 0 ) )
        for( i = 0 ; i < automatum_list.length ; i++)
            if ( automatum_list[i] >= 0 ) // slot populated with correct automatum index
            {
                $("#atm_name_"+i).html("Baie " + (2*automatum_list[i]+1) + '/' + (2*automatum_list[i]+2));
                $('.atm'+i).show();
            }
    light_opt = getXMLValue( data, 'light_opt' );	// led pwm dimmer period : 0=0s, 1=1s, 2=2s, 3=4s
}

///////////////////////////////////////////// manufacturer configuration ////////////////////////

function fill_user_entry()
{
/*	
	for ( idx = 0 ; idx < 2; idx ++ )
	{
		$('#lpo_forward'+idx).val( motor_configuration[idx].lpo_forward );
		$('#lpo_backward'+idx).val( motor_configuration[idx].lpo_backward );
		$('#gpi_forward_eoc'+idx).val( motor_configuration[idx].gpi_forward_eoc );
		$('#gpi_backward_eoc'+idx).val( motor_configuration[idx].gpi_backward_eoc );
		$('#gpo_power'+idx).val( motor_configuration[idx].gpo_power );
	}
*/	
		// this 2 settings are write enable, so id are specifics.
	$('#cal_manuf_17').val( motor_configuration[0].motor_max_count );
	$('#cal_manuf_18').val( motor_configuration[0].max_current_mAmps );
	$('#cal_manuf_19').val( motor_configuration[1].motor_max_count );
	$('#cal_manuf_20').val( motor_configuration[1].max_current_mAmps );
	$('#cal_manuf_21').val( motor_configuration[0].max_angle_degree );
	$('#cal_manuf_22').val( motor_configuration[1].max_angle_degree );
	$('#cal_manuf_22').val( motor_configuration[1].max_angle_degree );
//	$('#cal_manuf_23').val( pergola_orient );
	$('#cal_manuf_24').val( pergola_drying );
	
	$('#cal_manuf_25').val( motor_configuration[0].pit_kp );
	$('#cal_manuf_26').val( motor_configuration[0].pit_ki );
	$('#cal_manuf_27').val( motor_configuration[0].pit_kt );
	$('#cal_manuf_28').val( motor_configuration[1].pit_kp );
	$('#cal_manuf_29').val( motor_configuration[1].pit_ki );
	$('#cal_manuf_30').val( motor_configuration[1].pit_kt );
	
	$('#cal_manuf_31').val( motor_configuration[0].max_current_mAmps_h );
	$('#cal_manuf_32').val( motor_configuration[0].max_speed_h );
	$('#cal_manuf_33').val( motor_configuration[1].max_current_mAmps_h );
	$('#cal_manuf_34').val( motor_configuration[1].max_speed_h );
		// fw 1.3
	$('#cal_manuf_35').val( motor_configuration[0].h_current_offset );
	$('#cal_manuf_36').val( motor_configuration[1].h_current_offset );
	$('#cal_manuf_37').val( motor_configuration[0].h_switch_offset );
	$('#cal_manuf_38').val( motor_configuration[1].h_switch_offset );
	$('#cal_manuf_39').val( motor_configuration[0].zero_degree_offset );
	$('#cal_manuf_40').val( motor_configuration[1].zero_degree_offset );
		// fw 1.4
	$('#cal_board_1').val( board_version );
	$('#cal_board_2').val( board_rds );
	$('#cal_board_3').val( board_rth );
	$('#cal_board_4').val( board_mot_fs );
	$('#cal_board_5').val( board_led_fs );
		// fw 1.8+
	$('#cal_manuf_43').val( motor_configuration[0].max_speed_n );
	$('#cal_manuf_44').val( motor_configuration[1].max_speed_n );
	$('#cal_manuf_45').val( motor_configuration[0].delta_setpoint_h );
	$('#cal_manuf_46').val( motor_configuration[1].delta_setpoint_h );
	$('#cal_manuf_47').val( motor_configuration[0].delta_setpoint_n );
	$('#cal_manuf_48').val( motor_configuration[1].delta_setpoint_n );
	
	$('#cal_manuf_50').val( automatum_list[my_current_config_ID] ).change();
		
	$('#cal_manuf_51').val( 0 ).change();	
		
}

function parse_periodic_update_error(jqXHR, textStatus, errorThrown)
{
	toggle_led_connected(false);
	$('#page_light').addClass('ui-disabled');
	$('#page_motors').addClass('ui-disabled');
	$('#page_wifi').addClass('ui-disabled');
	$('#page_settings').addClass('ui-disabled');
}

// toggle connected led flag to connected ( true) or disconnected ( false )
function toggle_led_connected( connected )
{
    if ( connected == true )
    {
        document.querySelector('.connexion p').innerHTML = "Connecté";
        $('#sta_connected').addClass('ui-icon-green').removeClass('ui-icon-red');
    }
    else
    {
        document.querySelector('.connexion p').innerHTML = "Déconnecté";
        // $('#sta_connected').addClass('ui-icon-red').removeClass('ui-icon-green');
    }
}

function getXMLValue(xmlData, field, child) 
{
	child = typeof(child) == "undefined" ? 0 : child;
	
	try {
		if( xmlData.getElementsByTagName(field)[child].firstChild.nodeValue)
			return xmlData.getElementsByTagName(field)[child].firstChild.nodeValue;
		else
			return null;
	} catch(err) { return null; }
}

	// parse 'zns.cgi?cmd=d&p=iso' request result, update gui
    function parse_general_status(data)
    {
        
        if ( data == null )
        {
            toggle_led_connected(false);
            return;
        }
        var ret_code = getXMLValue( data, 'retcode' );
        if ( ret_code == '500' )
            return;
    
        var ans_ID = getXMLValue( data, 'ID' );
        if ( ans_ID != my_current_automatum_idx ) // answer from old request before automatum switch
            return;
            
        my_automatum_raw_data_array[my_current_automatum_idx] = data; // status cache for automatum change acceleration
    
        toggle_led_connected(true);
        
            // extract main monitoring data
        monitoring_temp = getXMLValue( data, 'Temp' );
        monitoring_VDC1 = getXMLValue( data, 'VDC1' );
        monitoring_VDC2 = getXMLValue( data, 'VDC2' );
        monitoring_sun = getXMLValue( data, 's_elev' );
        monitoring_date = getXMLValue( data, 'date' );
        monitoring_user_config = getXMLValue( data, 'user' );
        monitoring_sun_track_period = getXMLValue( data, 'sun_delay' );
        monitoring_tmos = getXMLValue( data, 'tmos' );
        monitoring_status = getXMLValue( data, 'status' );
    
        $('#page_light').removeClass('ui-disabled');
            // page motor enable handled on  monitoring_user_config&8
        $('#page_wifi').removeClass('ui-disabled');
        $('#page_settings').removeClass('ui-disabled');
        
            // extract General Purpose Outputs data
        for ( i = 0 ; i < 12 ; i++ )
        {
            var gpo = getXMLValue( data, 'gpo'+i );
            gpo = gpo.split(";");	// PWM ; current(mA)
            monitoring_GPO_PWM[i] = gpo[0];
            monitoring_GPO_I[i] = gpo[1];
        }
            // extract General Purpose Inputs data
        for ( i = 0 ; i < 6 ; i++ )
        {
            monitoring_GPI_V[i] = getXMLValue( data, 'gpi'+i );
        }
            // extract motors position and max count
        for ( i = 0 ; i < 2 ; i++ )
        {
            var pack = getXMLValue( data, 'Mot'+i );
            pack = pack.split(";");	// current count ; max count
            raw_motor_position[i] = pack[0];
            raw_motor_max_count[i] = pack[1];
            if ( pack.length >= 2 )
                raw_motor_flag[i] = pack[2];
        }
    
            // light memory #1 ( only one mem slot supported )
        var mem0pack = getXMLValue( data, 'mem0' );
        mem0pack = mem0pack.split(";");	// split 8 mem values
        for ( i = 0 ; i < 8 ; i++ )
        mem0_pwm[i] = mem0pack[i];
            
        // ====================> partie élévation solaire sur la mini bar
        
        //     // update header bar, visible in all pages
        // $("#sun").html( 'Elévation solaire : ' + monitoring_sun + ' &deg;' );
        // if ( monitoring_status & 2 ) // rain detected
        //     $("#sun").removeClass('ui-icon-sun').removeClass('ui-icon-night').addClass('ui-icon-rain');
        // else
        // {
        //     if ( monitoring_status & 32 ) // sun elevation below threshold
        //         $("#sun").removeClass('ui-icon-rain').removeClass('ui-icon-sun').addClass('ui-icon-night');
        //     else
        //         $("#sun").removeClass('ui-icon-rain').removeClass('ui-icon-night').addClass('ui-icon-sun');
        // }
    
        // ====================> partie heire sur la mini barre
        // var d_pergola = new Date( parseInt(monitoring_date)*1000 );	
        // var d_pergola_h = d_pergola.getHours();
        // d_pergola_h = (d_pergola_h < 10) ? ("0" + d_pergola_h) : d_pergola_h;
        // var d_pergola_m = d_pergola.getMinutes();
        // d_pergola_m = (d_pergola_m < 10) ? ("0" + d_pergola_m) : d_pergola_m;
        // $("#clock").html( d_pergola_h + ":"+d_pergola_m );
        
        // update gui according current active page
        let urlPageActuelle = location.href;
        let parties = urlPageActuelle.split("/");
        let activePage = parties[parties.length-1]
    
        // ====================> sur la page de moteurs (lames orientables)
        //     // on motors page ... update sliders position
        // if ( slider_auto_update && activePage == "lames_orientables.html")
        // {
        //         // convert count to percent
        //     var position_mot0 = 100*raw_motor_position[0]/raw_motor_max_count[0];	
        //     var position_mot1 = 100*raw_motor_position[1]/raw_motor_max_count[1];
        //         // update sliders
        //         //=> ici remplacer par mes sliders de lames
        //         let bbbbuble = document.querySelector(".bubble")
        //         let contVal = document.querySelectorAll(".value-range-wrap")
        //         setOffsetBubble(bbbbuble[0], contVal[0], position_mot0)
        //         setOffsetBubble(bbbbuble[1], contVal[1], position_mot1)
            
        //     // $( '#slider-motor-0' ).val( position_mot0 ).slider("refresh");
        //     // $( '#slider-motor-1' ).val( position_mot1 ).slider("refresh");
        // }	

        
        // ====================> sur la page de l'éclairage
            // on light page ... update leds power and sliders position
        // if ( slider_auto_update && activePage == "eclairage.html")
        // {
        //     for ( i = 4 ; i < 8 ; i++ )
        //     {
        //         var monit_v, monit_i, monit_p, text_led;
        //         if ( i < 4 )
        //             monit_v = monitoring_VDC1/1000;
        //         else
        //             monit_v = monitoring_VDC2/1000;
        //         monit_i = monitoring_GPO_I[i] / 1000;
        //             // compute power for this leds
        //         monit_p = monit_v * monit_i;
        //         if (i == 6)
        //             text_led = led6;
        //         if (i == 7)
        //             text_led = led7;
        //         text_led
        //         if ( monit_p < 10)
        //             $( "#pwr"+i ).text( text_led + monit_p.toFixed(1) + 'W' );
        //         else
        //             $( "#pwr"+i ).text( text_led + monit_p.toFixed(0) + 'W' );
        //     }
        //         // RVB power : 2 channels grouped.
        //     {
        //         var monit_v, monit_i, monit_p;
        //         monit_v = monitoring_VDC2/1000;
        //         monit_i = monitoring_GPO_I[4]/1000 + monitoring_GPO_I[5]/1000;
        //         monit_p = monit_v * monit_i;
        //         if ( monit_p < 10)
        //             $( "#pwr11" ).text( led11 + monit_p.toFixed(1) + 'W' );
        //         else
        //             $( "#pwr11" ).text( led11 + monit_p.toFixed(0) + 'W' );
        //     }
                
        //         // then update sliders
        //     $( '#slider-light-4' ).val( monitoring_GPO_PWM[4]*100/255 ).slider("refresh");
        //     $( '#slider-light-5' ).val( monitoring_GPO_PWM[5]*100/255 ).slider("refresh");
        //     $( '#slider-light-6' ).val( monitoring_GPO_PWM[6]*100/255 ).slider("refresh");
        //     $( '#slider-light-7' ).val( monitoring_GPO_PWM[7]*100/255 ).slider("refresh");
            
        //     $( '#slider-light-8' ).val( monitoring_GPO_PWM[8]*100/255 ).slider("refresh");
        //     $( '#slider-light-9' ).val( monitoring_GPO_PWM[9]*100/255 ).slider("refresh");
        //     $( '#slider-light-10' ).val( monitoring_GPO_PWM[10]*100/255 ).slider("refresh");
        //     $( '#slider-light-11' ).val( monitoring_GPO_PWM[11]*100/255 ).slider("refresh");
            
        //     if ( monitoring_GPO_PWM[4] == 0 )
        //         $("#checkbox-d4").prop('checked', false).checkboxradio('refresh');
        //     else
        //         $("#checkbox-d4").prop('checked', true).checkboxradio('refresh');
    
        //     if ( monitoring_GPO_PWM[5] == 0 )
        //         $("#checkbox-d5").prop('checked', false).checkboxradio('refresh');
        //     else
        //         $("#checkbox-d5").prop('checked', true).checkboxradio('refresh');
    
        //     if ( monitoring_GPO_PWM[6] == 0 )
        //         $("#checkbox-d6").prop('checked', false).checkboxradio('refresh');
        //     else
        //         $("#checkbox-d6").prop('checked', true).checkboxradio('refresh');
    
        //     if ( monitoring_GPO_PWM[7] == 0 )
        //         $("#checkbox-d7").prop('checked', false).checkboxradio('refresh');
        //     else
        //         $("#checkbox-d7").prop('checked', true).checkboxradio('refresh');
    
        // }
        
        // ====================> sur la page de settings
        //     // on settings page ... update pergola date and modes.
        // if ( activePage == "page_settings" )
        // {
        //         // convert pergola date (seconds) to JS date (milliseconds), and format string
        //     var d_pergola = new Date( parseInt(monitoring_date)*1000 );	
        //     $("#date_entry").val( d_pergola.toLocaleString() );
            
        //         // update toggle switch options
        //     $("#rain_mode").val( monitoring_user_config&1?1:0 ).flipswitch('refresh');
        //     $("#sun_track_en").val( monitoring_user_config&2?1:0 ).flipswitch('refresh');
        //     $("#sun_track_mode").val( monitoring_user_config&4?1:0 ).flipswitch('refresh');
        //     $("#wintering_en").val( monitoring_user_config&8?1:0 ).flipswitch('refresh');
        //     $("#auto_power_light").val( monitoring_user_config&16?1:0 ).flipswitch('refresh');
        //     $("#sun_update").val( monitoring_sun_track_period ).selectmenu("refresh", true);
        //     $("#pairing_en").val( monitoring_user_config&32?1:0 ).flipswitch('refresh');
        //     $("#pmw_period").val( light_opt&3 ).selectmenu("refresh", true);
        //     $("#synchrone_shaders").val( monitoring_user_config&128?1:0 ).flipswitch('refresh');
            
        // }
    
        // ====================> sur la page des lames orientables
        // if ( activePage == "lames_orientables.html" )
        // {
        //     if ( monitoring_user_config&(8|2) ) // V1.17 : disable manual motoir control if wintering OR sun tracking enabled.
        //         $('#page_motors').addClass('ui-disabled');
        //     else
        //         $('#page_motors').removeClass('ui-disabled');
        // }	
        
        // ====================> sur la page du setup
            // on settings page ... display all data ( summary )
        if ( activePage == "setup.html" )
        {
            var raw_data = '';
            raw_data += '<li>VIN #1      = ' + (monitoring_VDC1/1000) + ' V</li>';
            raw_data += '<li>VIN #2      = ' + (monitoring_VDC2/1000) + ' V</li>';
            raw_data += '<li>Board temp = ' + (monitoring_temp/10) + ' &deg;C</li>';
            raw_data += '<li>MOS temp = ' + (monitoring_tmos/10) + ' &deg;C</li>';
            for ( i = 0; i < 6 ; i++ )
                raw_data += '<li>GPI#' + i + ' = ' + (monitoring_GPI_V[i]/1000) + ' V</li>';
            for ( i = 0; i < 8 ; i++ )
                raw_data += '<li>GPO#' + i + ' = ' + (monitoring_GPO_I[i]/1000) + ' A / PWM = ' + monitoring_GPO_PWM[i] + '</li>';
            raw_data += '<li>GPO#R' + ' =  PWM = ' + monitoring_GPO_PWM[8] + '</li>';
            raw_data += '<li>GPO#G' + ' =  PWM = ' + monitoring_GPO_PWM[9] + '</li>';
            raw_data += '<li>GPO#B' + ' =  PWM = ' + monitoring_GPO_PWM[10] + '</li>';
            
            for ( i = 0; i < 2 ; i++ )
            {
                raw_data += '<li>Moteur #' + i + ' = ' + raw_motor_position[i] + ' / ' + raw_motor_max_count[i] + ' count';
                if ( raw_motor_flag[i] & 1 )
                    raw_data += ' [HOME_SET]';
                if ( raw_motor_flag[i] & 2 )
                    raw_data += ' [CURRENT_STOP]';
                if ( raw_motor_flag[i] & 4 )
                    raw_data += ' [RAIN_FLAG]';
                if ( raw_motor_flag[i] & 16 )
                    raw_data += ' [PID_UNLOCK_ERR]';
                if ( raw_motor_flag[i] & 32 )
                    raw_data += ' [TIMEOUT_ERR]';
                raw_data += '</li>';
            }
    
            raw_data += '<li>Pergola orientation = ' + pergola_orient + ' &deg;</li>';
            raw_data += '<li>Pergola location : lon=' + pergola_longitude + ' / lat=' + pergola_latitude +'</li>';
            
            raw_data += '<li>Sun elevation = ' + getXMLValue( data, 's_elev' ) + ' &deg;</li>';
            raw_data += '<li>Sun   azimut  = ' + getXMLValue( data, 's_azi' ) + ' &deg;</li>';
            raw_data += '<li>Sun projection on shaders= ' + getXMLValue( data, 's_prj' ) + ' &deg;</li>';
            
    //		$("#unpairing_en").val( monitoring_user_config&64?1:0 ).flipswitch('refresh');
            $('#manuf_raw_data').html(raw_data);
        }
    }

// ================================== APPLY  ==================================

// send a board  setting to pergola : note setting is not automatically saved, call save_board_config() to do that
// => Board version
function apply_board_config(suffix_id)
{
var cal_val = $("#cal_board_"+suffix_id).val();
    var command = '../cgi/zns.cgi?cmd=b&p=' + suffix_id + '&v=' + cal_val+my_current_automatum_cmd;
    $.ajax({
        url: command,	
        context: document.body
    }).done( function(data) {
        parse_command_ret(data);
    }).fail(  function( jqXHR, textStatus, errorThrown ) {
        parse_command_error(jqXHR, textStatus, errorThrown);
    });
}


// send a manufacturer setting to pergola : note setting is not automatically saved, call save_manuf_config() to do that
// => Temperature (0.1 Deg) 
function apply_manuf_config(suffix_id)
{
var cal_val = $("#cal_manuf_"+suffix_id).val();
    if ( suffix_id == '0' )
        cal_val = parseInt(cal_val) + 500;	// automatically add the 50°C offset to user entry
//	alert ('set parameter ' + suffix_id + ' to ' + cal_val );
    var command = '../cgi/zns.cgi?cmd=f&p=' + suffix_id + '&v=' + cal_val+my_current_automatum_cmd;
    $.ajax({
        url: command,	
        context: document.body
    }).done( function(data) {
        parse_command_ret(data);
    }).fail(  function( jqXHR, textStatus, errorThrown ) {
        parse_command_error(jqXHR, textStatus, errorThrown);
    });
}

// =====================


// request the pergola to save manufacturer settings. User need to entry correct password.
// => Save manufacturer settings
function save_manuf_config()
{
    var password = prompt("Please enter password", "xxxx");
    var command = '../cgi/zns.cgi?cmd=f&p=1234&v=' + password+my_current_automatum_cmd;
    $.ajax({
        url: command,	
        context: document.body
    }).done( function(data) {
        parse_command_ret(data);
    }).fail(  function( jqXHR, textStatus, errorThrown ) {
        parse_command_error(jqXHR, textStatus, errorThrown);
    });
}


// request the pergola to reload default  manufacturer settings
// => Load default manufacturer settings
function reset_manuf_config()
{
    var command = '../cgi/zns.cgi?cmd=f&p=1235&v=7913'+my_current_automatum_cmd;
    $.ajax({
        url: command,	
        context: document.body
    }).done( function(data) {
        parse_command_ret(data);
        startup_setup();
    }).fail(  function( jqXHR, textStatus, errorThrown ) {
        parse_command_error(jqXHR, textStatus, errorThrown);
    });
}

// restart homing manually : move to -10000 count.
// => Home motor
function manu_manuf_motor_home(mot_id)
{
    var command = '../cgi/zns.cgi?cmd=m&m=' + mot_id + '&p=-10000'+my_current_automatum_cmd;
    $.ajax({
        url: command,	
        context: document.body
    }).done( function(data) {
        parse_command_ret(data);
    }).fail(  function( jqXHR, textStatus, errorThrown ) {
        parse_command_error(jqXHR, textStatus, errorThrown);
    });
}
    
// move motor to count position [0..max_count]
// => Set motor position ( count )
function manu_manuf_motor()
{
var mot_pos = $( "#manu_manuf_motor_pos" ).val();
var mot_id = $( "#manu_manuf_motor_idx" ).val();
    var command = '../cgi/zns.cgi?cmd=m&m=' + mot_id + '&p=' + mot_pos+my_current_automatum_cmd;
    $.ajax({
        url: command,	
        context: document.body
    }).done( function(data) {
        parse_command_ret(data);
    }).fail(  function( jqXHR, textStatus, errorThrown ) {
        parse_command_error(jqXHR, textStatus, errorThrown);
    });
}

// move shader to angle position [0..angle_max]
// => Set shader position ( angle )
function manu_manuf_motor_a()
{
var mot_pos = $( "#manu_manuf_motor_pos_a" ).val();
var mot_id = $( "#manu_manuf_motor_idx_a" ).val();
    var command = '../cgi/zns.cgi?cmd=m&m=' + mot_id + '&a=' + mot_pos+my_current_automatum_cmd;
    $.ajax({
        url: command,	
        context: document.body
    }).done( function(data) {
        parse_command_ret(data);
    }).fail(  function( jqXHR, textStatus, errorThrown ) {
        parse_command_error(jqXHR, textStatus, errorThrown);
    });
}


// set led raw pwm value [0..255]
// => Set led pwm ( 0-255 count )
function manu_manuf_led()
{
var led_val = $( "#manu_manuf_led_val" ).val();
var led_id = $( "#manu_manuf_led_idx" ).val();
    var command = '../cgi/zns.cgi?cmd=l&o=' + led_id + '&p=' + led_val+my_current_automatum_cmd;
    $.ajax({
        url: command,	
        context: document.body
    }).done( function(data) {
        parse_command_ret(data);
    }).fail(  function( jqXHR, textStatus, errorThrown ) {
        parse_command_error(jqXHR, textStatus, errorThrown);
    });
}
    
// function download_hystory()
// {
// 	clearTimeout(refresh_chart_timer);
// 	$.ajax({
// 	  url: "../cgi/hystory.cgi",
// 	  beforeSend: function( xhr ) {
//     xhr.overrideMimeType( "text/plain; charset=x-user-defined" ); // overwrite charset to avoid 0x80+ ASCII code convertion.
//   },
// 	  processData: false,
// 	  context: document.body
// 	}).done(function(data) {
// 	  parse_hystory(data);
// 	}).fail( function (xhr, ajaxOptions, thrownError){
// 		alert ("error");
// 	});	
// }

// =====================================

// => la partie avec chart.js
// //Variables pour history
// var refresh_chart_timer = null;
// var init_chart = 0;
// var chart;
// function parse_hystory(data)
// {
// 	if ( data == null )
// 	{
// 		alert ( "History Fail");
// 		return;
// 	}
// 		// string to byte array
// 	var history = new Array();
// 	for ( var i = 0 ; i < data.length ; i++ )
// 		history[i] = data.charCodeAt(i)&0xFF;
// 	var history_ch0 = new Array();
// 	var history_ch1 = new Array();
// 		// byte array to 2 ch
// 	for ( var i = 0 ; i < 256 ; i++ )
// 	{
// 		history_ch0[i] = history[4*i+0] + history[4*i+1]*256;
// 		history_ch1[i] = history[4*i+2] + history[4*i+3]*256;
// 	}

// 	if ( !init_chart )
// 	{
// 		var ctx = document.getElementById('myChart').getContext('2d');
// 		chart = new Chart(ctx, {
// 			// The type of chart we want to create
// 			type: 'scatter',

// 			// The data for our dataset
// 			data: {
// 				datasets: [
// 				{
// 					label: "Motors #0 current",
// 					backgroundColor: 'rgb(255, 99, 132)',
// 					borderColor: 'rgb(255, 99, 132)',
// 					data: [],
// 				},
// 				{
// 					label: "Motors #1 current",
// 					backgroundColor: 'rgb(0, 99, 132)',
// 					borderColor: 'rgb(0, 99, 132)',
// 					data: [],
// 				}
				
// 				]
// 			},
// 			options: {
// 				animation: {
// 					duration: 0 // general animation time
// 				},
// 				showLines: true ,
// 				scales: {
// 					yAxes: [ {
// 						ticks: {
// 							beginAtZero:true
// 							}
// 					}]
// 				}
// 			}
// 		});

		
		
// 		for ( var i = 0 ; i < 256 ; i++ )
// 		{
// 			chart.data.datasets[0].data.push({x: (i-256)*4*8,y: i});
// 			chart.data.datasets[1].data.push({x: (i-256)*4*8,y: i});
// 		}
// 		chart.update();
// 		init_chart = 1; // chart inited
// 	}
	
// 	for ( var i = 0 ; i < 256 ; i++ )
// 	{
// 		chart.data.datasets[0].data[i].y = history_ch0[i];
// 		chart.data.datasets[1].data[i].y = history_ch1[i];
// //		chart.options.data[1].dataPoints[i].y = history_ch1[i];
// 	}
// 	chart.update();
	
// 	refresh_chart_timer = setTimeout("download_hystory()", 250);	
// }

// ================================== Firmware ================================


function firmware_upload() 
{
	var fd = new FormData();
	fd.append("i", document.getElementById('firmware_file').files[0]);
	var xhr = new getXMLHttpRequest();
	xhr.upload.addEventListener("progress", firmware_uploadProgress, false);
	xhr.addEventListener("load", firmware_uploadComplete, false);
	xhr.addEventListener("error", firmware_uploadFailed, false);
	xhr.addEventListener("abort", firmware_uploadCanceled, false);
//	xhr.open('POST', '/upload');
	xhr.open('POST', '../file/firmware');
	$('#page_manuf').html('<h1 id="progress_num">Please wait...</h1><progress id="progress_bar" value="0" max="100.0"></progress>');
	xhr.send(fd);
}


function getXMLHttpRequest() 
{
var xhr = null;
	if (window.XMLHttpRequest || window.ActiveXObject) 
	{
		if (window.ActiveXObject) 
		{
			try 
			{
				xhr = new ActiveXObject("Msxml2.XMLHTTP");
			} catch(e) 
			{
				xhr = new ActiveXObject("Microsoft.XMLHTTP");
			}
		} 
		else 
		{
			xhr = new XMLHttpRequest(); 
		}
	} 
	else 
	{
		alert("ERROR : XMLHttpRequestunavailable!");
		return null;
	}
	return xhr;
}


function firmware_uploadProgress(evt) {
	if (evt.lengthComputable) {
		var percentComplete = Math.round(evt.loaded * 100 / evt.total);
		document.getElementById('progress_num').innerHTML = 'Firmware upload ... ' + percentComplete.toString() + '%';
		document.getElementById('progress_bar').value = percentComplete;
	}
	else {
		document.getElementById('progress_num').innerHTML = 'unknow';
	}
}

function firmware_uploadComplete(evt)
{
	/* This event is raised when the server send back a response */
//            alert(evt.target.responseText);
//	alert('upload completed');
	$('#page_manuf').html('<h1>Please wait while restarting...</h1>');
	firmware_wait_restart();
//	window.location.reload();
}

function firmware_uploadFailed(evt) {
	alert("There was an error attempting to upload the file.");
}

function firmware_uploadCanceled(evt) {
	alert("The upload has been cancelled by the user or the browser dropped the connection.");
}


function firmware_wait_restart()
{
	$.ajax({
		url: '../cgi/version.cgi',	// ask for firmware version
		context: document.body
	})
	.done( function(data) { 	
			$('#page_manuf').html('<h1>Firmware ' + data + ' now running<br/>Please wait while reloading...</h1>' );
			setTimeout("window.location.reload();", 5000);
			})
	.fail(  function( jqXHR, textStatus, errorThrown )  {
//			$('#page_manuf').html('<h1>' + textStatus + '</h1>' );
			$('#page_manuf').find( "h1" ).append( "." );
			setTimeout("firmware_wait_restart();", 5000);
	});
	
}
