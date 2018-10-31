/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener('offline', this.onOffline, false);
        document.addEventListener('online', this.onOnline, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
	onOffline: function() {
		localStorage.setItem('online', false);
	},
	onOnline: function() {
		localStorage.setItem('online', true);
	},
    // Update DOM on a Received Event
    receivedEvent: function(id) {
		console.log("Device is ready");
		console.log("Raids");
		var b = check_authentification();
        main();
    }
};

function main() {
	var disconnection = document.getElementById("disconnect");
	disconnection.addEventListener("click", disconnect);
	
	var raidID = setIDintoTabs();
	console.log()
	
	var info = localStorage.getItem('info-'+raidID);

	if (info==null) {
		document.getElementById('connection-error').innerHTML = "informations indisponibles sans internet";
	} else {
		var info_json = JSON.parse(info);
		show_info(info_json);
	}
	
	var online = localStorage.getItem('online');
	console.log(online);
	if (online == 'true' || online == true) {
		document.getElementById('connection-error').innerHTML = "";
		var r = function(response, http_code) {
			response_json = JSON.parse(response);
			if (http_code==200) {
				localStorage.setItem('info-'+raidID, response);
				var name = localStorage.getItem('name');
				
				show_info(response_json);
				console.log(response);
				
			} else {
				console.log(response.message);
				console.log(response.code);
			}
		};

		apiCall('GET','helper/raid/'+raidID,null,r);
	}
}

function show_info(response) {
	
	var date = new Date(response.date.date);
	var month = date.getMonth()+1;
	date = date.getDate() +"/"+ month +"/"+ date.getFullYear();
	
	document.getElementById('name').innerHTML = response.name;
	document.getElementById('date').innerHTML = date;
	document.getElementById('address').innerHTML = response.address;
	document.getElementById('addressAddition').innerHTML = response.addressAddition;
	document.getElementById('postCode').innerHTML = response.postCode;
	document.getElementById('city').innerHTML = response.city;
	document.getElementById('editionNumber').innerHTML = response.editionNumber;
}
