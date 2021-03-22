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


$(document ).ready(function(){
	 startup_main(); 
}); 


	// extract simple xml key content
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

	// toggle connected led flag to connected ( true) or disconnected ( false )
function toggle_led_connected( connected )
{
	if ( connected == true )
	{
		document.getElementById('sta_connected').innerHTML = "Connecté";
		$('#sta_connected').addClass('ui-icon-green').removeClass('ui-icon-red');
	}
	else
	{
		document.getElementById('sta_connected').innerHTML = "Déconnecté";
		$('#sta_connected').addClass('ui-icon-red').removeClass('ui-icon-green');
	}
}


	/** periodic status request, and update gui */
function periodic_update_1s()
{
	$.ajax({
	  url: "zns.cgi?cmd=d&p=ios"+my_current_automatum_cmd,
	  context: document.body
	}).done(function(data) {
		parse_general_status(data);
	})
	.complete( function(event) {
				// call again update
			setTimeout("periodic_update_1s()", 500);
	}).error(  function( jqXHR, textStatus, errorThrown ) {
		parse_periodic_update_error(jqXHR, textStatus, errorThrown);
	});		
}

	/** handle user slide event on sliders <slider_id> */
function slider_handle_led( slider_id, new_value )
{
		// convert html slider in percent to pergola pwm[0..255]
	var new_intensity = new_value*255/100;
	$.ajax({
	  url: "zns.cgi?cmd=l&o="+slider_id+"&p="+new_intensity.toFixed(0)+my_current_automatum_cmd,
	  context: document.body
	}).done( function(data) {
		parse_command_ret(data);
	}).error(  function( jqXHR, textStatus, errorThrown ) {
		parse_command_error(jqXHR, textStatus, errorThrown);
	});
	slider_auto_update = 1;	// re-enable auto update
}

	/** handle user slide event on sliders <slider_id> */
function slider_handle_mot( slider_id, new_value )
{
	if ( slider_id & 1 )	// b1 : motor #0
	{
			// Pergola manage motors in count : convert percent to count
		var new_position = new_value/100*raw_motor_max_count[0];	
		var ws_command = 'zns.cgi?cmd=m&m=1&p=' + new_position.toFixed(0)+my_current_automatum_cmd ;
		$.ajax({
		  url: ws_command,
		  context: document.body
		}).done( function(data) {
		parse_command_ret(data);
	}).error(  function( jqXHR, textStatus, errorThrown ) {
		parse_command_error(jqXHR, textStatus, errorThrown);
	});
	}
	if ( slider_id & 2 )	// b1 : motor #1
	{
			// Pergola manage motors in count : convert percent to count
		var new_position = new_value/100*raw_motor_max_count[1];	
		var ws_command = 'zns.cgi?cmd=m&m=2&p=' + new_position.toFixed(0)+my_current_automatum_cmd ;
		$.ajax({
		  url: ws_command,
		  context: document.body
		}).done( function(data) {
		parse_command_ret(data);
	}).error(  function( jqXHR, textStatus, errorThrown ) {
		parse_command_error(jqXHR, textStatus, errorThrown);
	});
	}
	slider_auto_update = 1;	// re-enable auto update
}


	/** apply new PWM to selected leds. */
function group_leds_set(new_value)
{
var led_mask = 	$("#led_mask :radio:checked").val();
	slider_handle_led( led_mask, new_value );
}
	

function all_motor_set(new_value)
{
var motor_mask = 	$("#motor_mask :radio:checked").val();
	slider_handle_mot( motor_mask, new_value );
}
	
	/** attach event handler on sliders */
function init_sliders(slider_base_id)
{
	$ ( slider_base_id ).slider(
		{
		stop: function( event, ui ) 
			{
				var new_value = $(this).val();
				var slider_id = $(this).attr('id');
				if ( slider_id == "slider-light-10" )	// because we only read last char, "slider-light-10" return 0, not 10
					slider_id = 10;						// so force to read 10 !
				else
				{
					if ( slider_id == "slider-light-11" )	// because we only read last char, "slider-light-11" return 0, not 1
						slider_id = 11;						// so force to read 11 !
					else
						slider_id = slider_id.charAt(slider_id.length-1);
				}
					// call with mask 16, 32, 64 or 128
				if ( slider_id < 2 )	// 0 and 1 : motors sliders
					slider_handle_mot( 1<<slider_id, new_value );
				else					// 2 to 10, LEDs sliders.
					slider_handle_led( 1<<slider_id, new_value );
			},
		start: function( event, ui ) 
			{
				slider_auto_update = 0;	// suspend automatic slider position update when user start to drag
			}
		});
}

	/** send device date to pergola */
function sync_date()
{
	var now_date = new Date();
	var date_sec =  now_date.getTime();
	date_sec /= 1000;	// to seconds for use in pergola
	// set user setttings : zns.cgi?cmd=u&p=<n>&v=<value>
	var command = 'zns.cgi?cmd=u&p=0&v=' + date_sec+my_current_automatum_cmd;
	$.ajax({
	  url: command,	
	  context: document.body
	}).done( function(data) {
		parse_command_ret(data);
	}).error(  function( jqXHR, textStatus, errorThrown ) {
		parse_command_error(jqXHR, textStatus, errorThrown);
	});
}

function set_user_config( new_config )
{
	new_config &= 65535;	// bound to 16 bits
	if ( monitoring_user_config != new_config )
	{
		monitoring_user_config = new_config;	// anticipate to answer.
		var command = 'zns.cgi?cmd=u&p=3&v=' + new_config+my_current_automatum_cmd;
		$.ajax({
		  url: command,	
		  context: document.body
		}).done( function(data) {
			parse_command_ret(data);
		}).error(  function( jqXHR, textStatus, errorThrown ) {
		parse_command_error(jqXHR, textStatus, errorThrown);
	});
	}
}
function set_sun_tracking( en )
{
	if ( en != 0 )
		set_user_config ( monitoring_user_config | 2 );		// set tracking bit
	else
		set_user_config ( monitoring_user_config & ~2 );	// clr tracking bit
}

function set_sync_shaders( en )
{
	if ( en != 0 )
		set_user_config ( monitoring_user_config | 128 );		// set shaders synchro bit
	else
		set_user_config ( monitoring_user_config & ~128 );	// clr shaders synchro bit
}


function set_wintering( en )
{
	if ( en != 0 )
		set_user_config ( monitoring_user_config | 8 );		// set wintering  bit
	else
		set_user_config ( monitoring_user_config & ~8 );	// clr wintering  bit
}

function set_winter_mode( en )
{
	if ( en != 0 )
		set_user_config ( monitoring_user_config | 4 );		// set winter bit
	else
		set_user_config ( monitoring_user_config & ~4 );	// clr winter bit
}
function set_rain_mode( en )
{
	if ( en != 0 )
		set_user_config ( monitoring_user_config | 1 );		// set rain mode bit
	else
		set_user_config ( monitoring_user_config & ~1 );	// clr rain mode bit
}

function set_auto_power_light( en )
{
	if ( en != 0 )
		set_user_config ( monitoring_user_config | 16 );	// set auto power on light mode bit
	else
		set_user_config ( monitoring_user_config & ~16 );	// clr auto power on light mode bit
}



function rvb_callback(color)
{
	var red = parseInt(color.substring(1,3),16);
	var green = parseInt(color.substring(3,5),16);
	var blue = parseInt(color.substring(5,7),16);
	slider_handle_led( 256, red*100/255 );			
	slider_handle_led( 512, 0.7*(green*100/255) );			// Green LED light better than green and blue.
	slider_handle_led( 1024, blue*100/255 );			
//	alert( red + " " +  green + " " + blue );

}
		
function apply_shader_close_treshold()
{
	shader_close_treshold = $('#shader_close_treshold').val()
	var h = parseInt(shader_close_treshold);
	var command = 'zns.cgi?cmd=u&p=7&v=' + h+my_current_automatum_cmd;
	$.ajax({
	  url: command,	
	  context: document.body
	}).done( function(data) {
		parse_command_ret(data);
	}).error(  function( jqXHR, textStatus, errorThrown ) {
	parse_command_error(jqXHR, textStatus, errorThrown);
	});
}

function apply_pergola_orientation()
{
	pergola_orient = $('#pergola_orient_usr').val()
	var h = parseInt(pergola_orient);
	var command = 'zns.cgi?cmd=u&p=10&v=' + h+my_current_automatum_cmd;
	$.ajax({
	  url: command,	
	  context: document.body
	}).done( function(data) {
		parse_command_ret(data);
	}).error(  function( jqXHR, textStatus, errorThrown ) {
	parse_command_error(jqXHR, textStatus, errorThrown);
	});
}


function apply_pergola_location()
{
	pergola_latitude = $('#loc_lat_angle').val();
	pergola_latitude.replace(',','.');
	
	
	if ( $('#loc_lat_ns').val() != 0 )
		pergola_latitude = - parseFloat(pergola_latitude);
	else
		pergola_latitude = parseFloat(pergola_latitude);

	pergola_longitude = $('#loc_long_angle').val();
	pergola_longitude.replace(',','.');
	if ( $('#loc_lon_eo').val() != 0 )
		pergola_longitude = - parseFloat(pergola_longitude);
	else
		pergola_longitude = parseFloat(pergola_longitude);
	
	
	
	var command_long = 'zns.cgi?cmd=u&p=11&v=' + pergola_longitude + my_current_automatum_cmd;
	$.ajax({
	  url: command_long,	
	  context: document.body
	}).done( function(data) {
		parse_command_ret(data);
		var command_lat = 'zns.cgi?cmd=u&p=12&v=' + pergola_latitude + my_current_automatum_cmd;
		$.ajax({
		  url: command_lat,	
		  context: document.body
		}).done( function(data) {
			parse_command_ret(data);
		}).error(  function( jqXHR, textStatus, errorThrown ) {
		parse_command_error(jqXHR, textStatus, errorThrown);
	});
		
	});

}

function apply_ligt_off_h() 
{
	ligt_off_h = $('#ligt_off_h').val()
	var command = 'zns.cgi?cmd=u&p=6&v=' + localHourToGMTHour(ligt_off_h)+my_current_automatum_cmd;
	$.ajax({
	  url: command,	
	  context: document.body
	}).done( function(data) {
		parse_command_ret(data);
	}).error(  function( jqXHR, textStatus, errorThrown ) {
	parse_command_error(jqXHR, textStatus, errorThrown);
	});
}

	// save lamp configuration for auto on/off usage
function save_light_preset()
{
	var command = 'zns.cgi?cmd=u&p=8&v=1'+my_current_automatum_cmd;
	$.ajax({
	  url: command,	
	  context: document.body
	}).done( function(data) {
		parse_command_ret(data);
		$( "#messagebox_msg").html('<br/>' + "Cette configuration d'éclairage sera utilisée pour les allumages automatique" + '<br/>');
		$( "#messagebox" ).popup( "open" );

	}).error(  function( jqXHR, textStatus, errorThrown ) {
	parse_command_error(jqXHR, textStatus, errorThrown);
	});
}
function apply_ligt_on_h()
{
	ligt_on_h = $('#ligt_on_h').val();
	var command = 'zns.cgi?cmd=u&p=5&v=' + localHourToGMTHour(ligt_on_h)+my_current_automatum_cmd;
	$.ajax({
	  url: command,	
	  context: document.body
	}).done( function(data) {
		parse_command_ret(data);
	}).error(  function( jqXHR, textStatus, errorThrown ) {
	parse_command_error(jqXHR, textStatus, errorThrown);
	});
}

function customize_user_interface(hwconfig)
{
	// show enabled elements

	if ( (hwconfig&1) && (hwconfig&2) )	// motor 1 AND 2 installed
	{
		$(".MOT1").show(); 	// motor 1 buttons
		$(".MOT2").show();	// motor 2 buttons
		$(".MOT12").show(); // grouped motors buttons
	}
	else // only one 
	{
		if ( hwconfig&1 )	// motor 1 only
		{
			$("#motor_all").prop('checked', false);
			$("#motor_0").prop('checked', true);
			$("#mot0").html("Volet");
			$(".MOT1").show();
		}
		if ( hwconfig&2 )	// motor 2 only
		{
			$("#motor_all").prop('checked', false);
			$("#motor_1").prop('checked', true);
			$("#mot1").html("Volet");
			$(".MOT2").show();
		}
	}
	
	if ( (hwconfig&4) && (hwconfig&8) )	// WHITE 1 AND 2 installed
	{
		$(".WHITE1").show();
		$(".WHITE2").show();
	}
	else
	{
		if (hwconfig&4) // only WHITE 1
		{
			led6 = "Bandeau Blanc ";
			$("label[for='checkbox-d6']").html(led6);
			$("#pwr6").html(led6);
			$(".WHITE1").show();
		}
		if (hwconfig&8) // only WHITE 2
		{
			led7 = "Bandeau Blanc ";
			$("label[for='checkbox-d7']").html(led7);
			$("#pwr7").html(led7);
			$(".WHITE2").show();
		}
	}
	
	if (hwconfig&16) // RGB1 populated
	{
		$("label[for='checkbox-d4']").html("Bandeau RVB");
		$(".RGB1").show();
		$(".RGB12").show(); // RGB common widgets
	}
	if (hwconfig&32) // RGB2 populated
	{
		$("label[for='checkbox-d5']").html("Bandeau RVB");
		$(".RGB2").show();
		$(".RGB12").show(); // RGB common widgets
	}
	
	if (hwconfig&(16+32)) // RGB1 or RGB2 populated
	{
		if ( pick_color_rgb != 0 )
			$("#rgb_panel").show();
		else
			$("#pick_panel").show();
	}
	
}

	// call this when changing current automatum
function change_automatum()
{
	slider_auto_update = 1;
		// default : hide all "hideable"
	$(".MOT1").hide();
	$(".MOT2").hide();
	$(".MOT12").hide(); // with 2 motors config.
	$(".WHITE1").hide();
	$(".WHITE2").hide();
	$(".RGB1").hide();
	$(".RGB2").hide();
	$(".RGB12").hide();
	
	$(".atm0").hide();
	$(".atm1").hide();
	$(".atm2").hide();
	$(".atm3").hide();
	
	$(".RGB1").hide();
	$(".RGB2").hide();
	$(".RGB12").hide(); 
	
		// start without pickup wheel/RGB
	$("#rgb_panel").hide();
	$("#pick_panel").hide();


		// if status for this new automatum is already known, refres data displayed.
	if ( my_automatum_raw_data_array[my_current_automatum_idx] != null )
		parse_general_status(my_automatum_raw_data_array[my_current_automatum_idx]);
	
	$("#scan_result").text("");
	if ( my_automatum_raw_scan_array[my_current_automatum_idx] != null )
		parse_scan_result( my_automatum_raw_scan_array[my_current_automatum_idx] );
		
		
	if ( my_automatum_raw_configuration_array[my_current_automatum_idx] != null )
	{
		parse_configuration(my_automatum_raw_configuration_array[my_current_automatum_idx]);
		customize_user_interface(hwcfg);
	}

		// get/reget actual configuration
	$.ajax({
	  url: 'zns.cgi?cmd=c'+my_current_automatum_cmd,	
	  context: document.body
	}).done(function(data) {
		my_automatum_raw_configuration_array[my_current_automatum_idx] = data;
		parse_configuration(data);
		customize_user_interface(hwcfg);
		pergola_orient = Math.floor(((parseInt(pergola_orient,10)*4)+45)/90); // to index 0..15 ( of 22.5 deg step )
		pergola_orient = Math.floor(pergola_orient * 45 / 2) ;					// index to degree
		ligt_on_h = getXMLValue( data, 'ligt_on_h' );	// auto light on at this time
		ligt_off_h = getXMLValue( data, 'ligt_off_h' );	// auto light on at this time
	}).error(  function( jqXHR, textStatus, errorThrown ) {
		parse_command_error(jqXHR, textStatus, errorThrown);
	});
}

	/** pergola.html javascript entry point */
function startup_main()
{
	slider_auto_update = 1;
	

		// get legnet from HTML to enqueue power on label
		// => sur la page éclairage
	led6 = document.getElementById("pwr6").innerHTML;
	led7 = document.getElementById("pwr7").innerHTML;
	led11 = document.getElementById("pwr11").innerHTML;
	
	//=> si on change de "baie X"
	$("#automatum_sel").change(function() {
		my_current_automatum_idx = $("#automatum_sel :radio:checked").val();
		my_current_automatum_cmd = '&ID='+my_current_automatum_idx;
		change_automatum();
	}); 
	
//	$( document ).delegate("#page_light", "pageinit", function() {
	$( "#page_light" ).on( "pageshow", function( event, ui ) { 
		if ( slider_light_inited == 0 )
		{
		  init_sliders( '#slider-light-4' );
		  init_sliders( '#slider-light-5' );
		  init_sliders( '#slider-light-6' );
		  init_sliders( '#slider-light-7' );
		  init_sliders( '#slider-light-8' );
		  init_sliders( '#slider-light-9' );
		  init_sliders( '#slider-light-10' );
		  init_sliders( '#slider-light-11' );
		  slider_light_inited = 1; // call one at startup
		}
	});
	
	$( document ).delegate("#page_motors", "pageinit", function() {
	  init_sliders( '#slider-motor-0' );
	  init_sliders( '#slider-motor-1' );
	});
	
	$( "#page_settings" ).on( "pageshow", function( event, ui ) { 
			// v1.20 : refresh configuration here (avoir missrefresh)
		$('#shader_close_treshold').val( shader_close_treshold );
		$("#pergola_orient_usr").val( pergola_orient ).selectmenu("refresh", true);
		$('#loc_lat_angle').val( Math.abs(pergola_latitude) );
		if ( pergola_latitude < 0 )
			$("#loc_lat_ns").val( 1 ).selectmenu("refresh", true); // south
		else
			$("#loc_lat_ns").val( 0 ).selectmenu("refresh", true);	// north

		$('#loc_long_angle').val( Math.abs(pergola_longitude) );
		if ( pergola_longitude < 0 )
			$("#loc_lon_eo").val( 1 ).selectmenu("refresh", true); // West
		else
			$("#loc_lon_eo").val( 0 ).selectmenu("refresh", true);	// East
		$('#ligt_on_h').val( GMTHourTolocalHour(ligt_on_h) );
		$('#ligt_off_h').val( GMTHourTolocalHour(ligt_off_h) );
	});
	
	$( document ).delegate("#page_settings", "pageinit", function() {
		
		$('#wintering_en').on('change', function() {
			set_wintering( $('#wintering_en').val() );
		});
		
		$('#sun_track_en').on('change', function() {
			set_sun_tracking( $('#sun_track_en').val() );
		});
		
		$('#synchrone_shaders').on('change', function() {
			set_sync_shaders( $('#synchrone_shaders').val() );
		});
		
		$('#sun_track_mode').on('change', function() {
			set_winter_mode( $('#sun_track_mode').val() );
		});
		
		$('#rain_mode').on('change', function() {
			set_rain_mode( $('#rain_mode').val() );
		});
		
		$('#auto_power_light').on('change', function() {
			set_auto_power_light( $('#auto_power_light').val() );
		});
		/*
		$('#pairing_en').on('change', function() {
			set_pairing( $('#pairing_en').val() );
		});
		*/
		$('#sun_update').on('change', function() {
			sun_upd_per = $('#sun_update').val()
			var command = 'zns.cgi?cmd=u&p=4&v=' + sun_upd_per+my_current_automatum_cmd;
			$.ajax({
			  url: command,	
			  context: document.body
			}).done( function(data) {
				parse_command_ret(data);
			}).error(  function( jqXHR, textStatus, errorThrown ) {
			parse_command_error(jqXHR, textStatus, errorThrown);
		});
		});
		
		$('#pmw_period').on('change', function() {
			light_opt = $('#pmw_period').val()
			var command = 'zns.cgi?cmd=u&p=9&v=' + light_opt+my_current_automatum_cmd;
			$.ajax({
			  url: command,	
			  context: document.body
			}).done( function(data) {
				parse_command_ret(data);
			}).error(  function( jqXHR, textStatus, errorThrown ) {
			parse_command_error(jqXHR, textStatus, errorThrown);
		});
		});
	});

	$( document ).delegate("#page_wifi", "pageinit", function() {
		$( "#scan_button" ).bind( "click", function(event, ui) {
			start_scan();
		});
	});
	
	 $("#checkbox-d4").click(function(){
		if ( $('#checkbox-d4').is(':checked') )
		{
			slider_handle_led(16, 100);		// toggle on
//			slider_handle_led(2048, 100);	// set RVB intensity to 100%
			slider_handle_led(256,  mem0_pwm[4]*100/255 );	// set R PWM to mem0
			slider_handle_led(512,  mem0_pwm[5]*100/255 );	// set R PWM to mem0
			slider_handle_led(1024, mem0_pwm[6]*100/255 );	// set R PWM to mem0
			slider_handle_led(2048, mem0_pwm[7]*100/255 );	// set RVB intensity to mem0
		}
		else
			slider_handle_led(16, 0);
    });
	 $("#checkbox-d5").click(function(){
		if ( $('#checkbox-d5').is(':checked') )
		{
			slider_handle_led(32, 100);		// toggle on
//			slider_handle_led(2048, 100);	// set RVB intensity to 100%
			slider_handle_led(256,  mem0_pwm[4]*100/255 );	// set R PWM to mem0
			slider_handle_led(512,  mem0_pwm[5]*100/255 );	// set R PWM to mem0
			slider_handle_led(1024, mem0_pwm[6]*100/255 );	// set R PWM to mem0
			slider_handle_led(2048, mem0_pwm[7]*100/255 );	// set RVB intensity to mem0
		}
		else
			slider_handle_led(32, 0);
    });
	 $("#checkbox-d6").click(function(){
		if ( $('#checkbox-d6').is(':checked') )
//			slider_handle_led(64, 100);		// set White#1 intensity to 100%
			slider_handle_led(64, mem0_pwm[2]*100/255 );	// set White#1 intensity to mem0
		else
			slider_handle_led(64, 0);
    });
	 $("#checkbox-d7").click(function(){
		if ( $('#checkbox-d7').is(':checked') )
//			slider_handle_led(128, 100);	// set White#2 intensity to 100%
			slider_handle_led(128, mem0_pwm[3]*100/255 );	// set White#2 intensity to mem0
		else
			slider_handle_led(128, 0);
    });	
	
	$("#show_rgb").click(function(){		
		$("#pick_panel").hide();
		$("#rgb_panel").show();
		pick_color_rgb = 1;
	});
	
	$("#show_wheel").click(function(){		
		$("#pick_panel").show();
		$("#rgb_panel").hide();
		pick_color_rgb = 0;
	});
	

		// init widget
	$('#colorpicker').farbtastic(rvb_callback);
//	var colorPicker = $.farbtastic("#colorpicker");
//	colorPicker.linkTo(rvb_callback);			
		// start periodic status update
	setTimeout("periodic_update_1s()", 1000);
		// V1.17 : automatically sync date
	setTimeout("sync_date()", 1000);
	
	
	change_automatum();
}




///////////////////////////////////////////// wifi configuration ////////////////////////

var bss_array = new Array();

	// switch to selected bss in <bss_array> network list.
function switch_network(idx)
{
	var password = "";
	if ( bss_array[idx].sec & 16 ) // not an open network, ask user for password
		password = prompt('enter security key for network ' +  bss_array[idx].ssid );
		
	$.post( "zns_post.cgi", { sec:bss_array[idx].sec, key:password, id:bss_array[idx].id, type:bss_array[idx].type } )
		.done( 
				function( data ) {
				alert( "You need to connect your device to network " + bss_array[idx].id + " to continue to use Zenisun pergola" );	
				}
			).error(  function( jqXHR, textStatus, errorThrown ) {
		parse_command_error(jqXHR, textStatus, errorThrown);
	});
}

function parse_scan_result(data)
{
	var count = getXMLValue( data, 'count' );
	bss_array.length = 0	// clear previous scan result
	for ( i = 0; i < count ; i++ )
	{
		var value = i;
		var bss = data.getElementsByTagName('bss');
		var bss_elem = {};	// struct to store data
		
		bss_elem.id = getXMLValue( bss[i], 'id' );			// network name : eg "Freebox_Wifi_xxx"
		var rssi = getXMLValue( bss[i], 'rssi' );
		if (rssi < 43) rssi = 43; 	// min = 43 = -95 dBm
		rssi = (rssi-43)/(128-43);	// en %
		rssi = 95*(1 - rssi);	// 95 to 0 dBm
		rssi = "-" + Math.round(rssi) + " dBm";
//				bss_elem.rssi = getXMLValue( bss[i], 'rssi' );			// rssi level
		bss_elem.rssi = rssi;			// rssi level in dbm
		bss_elem.sec = getXMLValue( bss[i], 'sec' );	// security : open, web, wpa, wpa2.
		bss_elem.type = getXMLValue( bss[i], 'type' );	// 1 = infrastructure, 2 = AdHoc network
		bss_elem.channel = getXMLValue( bss[i], 'channel' );	// wifi channel ( 1..7 or 8 )
			// store for connection callback on refresh.
		bss_array[i] = bss_elem;
		
		var img_sec = '/images/open.png';
		if  ( bss_elem.sec & 16 )	// security key
		{
			img_sec = '/images/closed.png';
			txt_sec = '';
			if  ( bss_elem.sec&128 )
				txt_sec += 'WPA2, ';
			else 
				if  ( bss_elem.sec&64 )
					txt_sec += 'WPA, ';
				else 
					txt_sec += 'WEP, ';
		}
		else
			txt_sec = 'Open, ';
		
		txt_sec += 'channel ' + bss_elem.channel; 
		var listItem = '<li><a href="#" onclick="switch_network(' + i + ');"><img src=' + img_sec + ' /><h2>' + bss_elem.id + '</h2><p>' + txt_sec + '</p><span class="ui-li-count">' + bss_elem.rssi + '</span></a></li>';
		$("#scan_result").append(listItem);
	}
	$("#scan_result").listview('refresh');	
}
	// get previously run of network scan
function get_scan_resul()
{
	$.ajax({
		url: 'zns.cgi?cmd=s&p=g'+my_current_automatum_cmd,	// get scan result
		context: document.body
	})
	.done(function(data) {
			my_automatum_raw_scan_array[my_current_automatum_idx] = data;
			parse_scan_result(data);
		}).error(  function( jqXHR, textStatus, errorThrown ) {
		parse_command_error(jqXHR, textStatus, errorThrown);
	});
}

	// start network scan ( detect networks )
function start_scan()
{
	$('#scan_button').prop('disabled', true).addClass('ui-disabled');
	$("#scan_result").text("");
	$.mobile.loading('show');
	$.ajax({
		url: 'zns.cgi?cmd=s&p=s'+my_current_automatum_cmd,	// start a scan
		context: document.body
	})
	.done( function(data) { 	
			get_scan_resul(data);}
			)
	.complete( function(event) {
			$('#scan_button').prop('enabled', true).removeClass('ui-disabled');
			$.mobile.loading('hide');
		})
	.error(  function( jqXHR, textStatus, errorThrown ) {
	parse_command_error(jqXHR, textStatus, errorThrown);
	});		
} 



///////////////////////////////////////////// manufacturer configuration ////////////////////////




	// request the pergola to save board settings. User need to entry correct password.
function save_board_config()
{
	var password = prompt("Please enter password", "xxxx");
	var command = 'zns.cgi?cmd=b&p=1234&v=' + password+my_current_automatum_cmd;
	$.ajax({
	  url: command,	
	  context: document.body
	}).done( function(data) {
		parse_command_ret(data);
	}).error(  function( jqXHR, textStatus, errorThrown ) {
		parse_command_error(jqXHR, textStatus, errorThrown);
	});
}


	// request the pergola to reload default  manufacturer settings
function reset_manuf_config()
{
	var command = 'zns.cgi?cmd=f&p=1235&v=7913'+my_current_automatum_cmd;
	$.ajax({
	  url: command,	
	  context: document.body
	}).done( function(data) {
		parse_command_ret(data);
		startup_setup();
	}).error(  function( jqXHR, textStatus, errorThrown ) {
		parse_command_error(jqXHR, textStatus, errorThrown);
	});
}




	// try to get gps coordinates automatically from device browser
/*	
function auto_gps()
{
	if (navigator.geolocation)
	{
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alert ("Geolocation is not supported by this browser.");
    }
}
*/
/*
function showPosition( position ) 
{
//	$('#longitude_entry').val(position.coords.longitude);
//	$('#latitude_entry').val(position.coords.latitude);
}
*/

	// send GPS coordinates to pergola
	/*
function apply_gps()
{
	var longitude = $('#longitude_entry').val();
	var latitude = $('#latitude_entry').val();
	longitude.replace(',','.');
	latitude.replace(',','.');
	var command_long = 'zns.cgi?cmd=f&p=41&v=' + longitude+my_current_automatum_cmd;
	$.ajax({
	  url: command_long,	
	  context: document.body
	}).done( function(data) {
		parse_command_ret(data);
		var command_lat = 'zns.cgi?cmd=f&p=42&v=' + latitude+my_current_automatum_cmd;
		$.ajax({
		  url: command_lat,	
		  context: document.body
		}).done( function(data) {
			parse_command_ret(data);
		}).error(  function( jqXHR, textStatus, errorThrown ) {
		parse_command_error(jqXHR, textStatus, errorThrown);
	});
		
	});
}
*/

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
		$( "#messagebox_msg").html('<br/>' + str_error + '<br/>');
		$( "#messagebox" ).popup( "open" )
	}
	else
	{
//		$( "#messagebox_msg").html("<br/>Operation success<br/>");
//		$( "#messagebox" ).popup( "open" )
	}
}


function parse_periodic_update_error(jqXHR, textStatus, errorThrown)
{
	toggle_led_connected(false);
	$('#page_light').addClass('ui-disabled');
	$('#page_motors').addClass('ui-disabled');
	$('#page_wifi').addClass('ui-disabled');
	$('#page_settings').addClass('ui-disabled');
}

	// menu highlight : menuitems <li> must have same text as page data-title.
$(function() {
	$( "[data-role='navbar']" ).navbar();
	$( "[data-role='header'], [data-role='footer']" ).toolbar();
});

	// Update the contents of the toolbars
$( document ).on( "pagecontainerchange", function() {
		// Each of the pages has a data-title attribute
		// which value is equal to the text of the nav button
	var current = $( ".ui-page-active" ).jqmData( "title" );
		// Change the heading
	$( "[data-role='header'] h1" ).text( current );
		// Remove active class from nav buttons
	$( "[data-role='navbar'] a.ui-btn-active" ).removeClass( "ui-btn-active" );
		// Add active class to current nav button
	$( "[data-role='navbar'] a" ).each(function() {
		if ( $( this ).text() === current ) {
			$( this ).addClass( "ui-btn-active" );
		}
	});
});

// =============================== Firmware user ===============================
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

function usr_firmware_upload() 
{
	var fd = new FormData();
	fd.append("i", document.getElementById('firmware_file').files[0]);
	var xhr = new getXMLHttpRequest();
	xhr.upload.addEventListener("progress", firmware_uploadProgress, false);
	xhr.addEventListener("load", firmware_uploadComplete_usr, false);
	xhr.addEventListener("error", firmware_uploadFailed, false);
	xhr.addEventListener("abort", firmware_uploadCanceled, false);
//	xhr.open('POST', '/upload');
	xhr.open('POST', '/firmware');
	$('#page_settings').html('<h1 id="progress_num">Please wait...</h1><progress id="progress_bar" value="0" max="100.0"></progress>');
	xhr.send(fd);
}
		
function firmware_uploadComplete_usr(evt)
{
	/* This event is raised when the server send back a response */
//            alert(evt.target.responseText);
//	alert('upload completed');
	$('#page_settings').html('<h1>Please wait while restarting...</h1>');
	firmware_wait_restart_usr();
//	window.location.reload();
}

function firmware_wait_restart_usr()
{
	$.ajax({
		url: '/version.cgi',	// ask for firmware version
		context: document.body
	})
	.done( function(data) { 	
			$('#page_settings').html('<h1>Firmware ' + data + ' now running<br/>Please wait while reloading...</h1>' );
			setTimeout("window.location.reload();", 5000);
			})
	.error(  function( jqXHR, textStatus, errorThrown )  {
//			$('#page_manuf').html('<h1>' + textStatus + '</h1>' );
			$('#page_settings').find( "h1" ).append( "." );
			setTimeout("firmware_wait_restart();", 5000);
	});
	
}

// =============================== Answer command ajax ===============================

function parse_command_error(jqXHR, textStatus, errorThrown)
{
	$( "#messagebox_msg").html('<br/>' + "Déconnecté" + '<br/>');
	$( "#messagebox" ).popup( "open" );
	return;
}