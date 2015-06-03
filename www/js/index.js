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

//Update with the api token for your app from https://app.bluecats.com
var blueCatsAppToken = '9e93e60f-55f3-4632-bede-8e8a91974651';

var app = {
  // Application Constructor
  initialize: function() {
    console.log('INITIALIZING APPLICATION');
    this.bindEvents();
    this.initCountdownTimer();
  },
  // Bind Event Listeners
  //
  // Bind any events that are required on startup. Common events are:
  // 'load', 'deviceready', 'offline', and 'online'.
  bindEvents: function() {
    document.addEventListener('deviceready', this.onDeviceReady, false);
  },
  stopwatch: {
    targetDuration: (30 * 60 * 1000), // Minutes * 60 * 1000
    initialCount: 0,
    currentCount: 0,
    targetCount: 0,
    timeout: null,
    elem: null,
    toggleButton: null,
    restartButton: null,
    message: null,
    expired: false,
    state: ''
  },
  countdown: function() {
    console.log('..... COUNTING DOWN');
    //console.log('...... Time difference is ' + ((new Date).getTime() - app.stopwatch.currentCount));

    //app.stopwatch.currentCount -= 100;
    app.stopwatch.currentCount = (new Date).getTime();

    var timeLeft = app.stopwatch.targetCount - app.stopwatch.currentCount; 
    //var timeLeft = app.stopwatch.currentCount;
    console.log('....... Time left is ' + timeLeft);

    //if (app.stopwatch.targetCount <= app.stopwatch.currentCount) {
    if (timeLeft <= 0) {
      console.log('TIMER FINISHED!');
      app.setTimerState('enforcer');
      app.stopwatch.state = 'expired';
      clearTimeout(app.stopwatch.timeout);
    } else {
      app.stopwatch.timeout = setTimeout(app.countdown, 100); // Check every 100 milliseconds
      
      app.stopwatch.elem.innerHTML = app.formatTimer(timeLeft);
    }
  },
  initCountdownTimer: function() {
    console.log('... Initializing countdown timer.');

    app.stopwatch.elem = document.getElementById('timer');
    app.stopwatch.toggleButton = document.getElementById('toggleButton');
    app.stopwatch.restartButton = document.getElementById('restartButton');
    app.stopwatch.message = document.getElementById('message');
    app.stopwatch.state = 'ready';

    app.setTimerState('ready');
  },
  startCountdownTimer: function() {
    app.stopwatch.initialCount = (new Date).getTime();
    app.stopwatch.currentCount = app.stopwatch.initialCount;
    app.stopwatch.targetCount = app.stopwatch.initialCount + app.stopwatch.targetDuration;
    app.stopwatch.state = 'running';

    app.setTimerState('running');
    app.countdown();
  },
  restartCountdownTimer: function() {
    clearTimeout(app.stopwatch.timeout);
    app.stopwatch.state = 'ready';

    app.setTimerState('ready');
  },
  runBreakMode: function() {
    clearTimeout(app.stopwatch.timeout);
    app.stopwatch.state = 'breaksuccess';

    app.setTimerState('breaksuccess');
  },
  setTimerState: function(state) {
    switch (state) {
      case 'ready':
        document.body.className = '';
        app.stopwatch.elem.innerHTML = app.formatTimer(0);
        app.stopwatch.message.innerHTML = 'Click "Start Work" to begin timing your hour of solid work.';
        app.stopwatch.toggleButton.setAttribute('style', 'display:block;');
        app.stopwatch.restartButton.setAttribute('style', 'display:block;');
        app.stopwatch.toggleButton.innerHTML = 'Start Work';
        app.stopwatch.restartButton.innerHTML = 'Reset Timer';

        app.stopwatch.toggleButton.onclick = app.startCountdownTimer;
        app.stopwatch.restartButton.onclick = app.restartCountdownTimer;

        break;
      case 'running':
        document.body.className = 'running';
        app.stopwatch.message.innerHTML = 'Time to work away and be productive! Go go go!';
        app.stopwatch.toggleButton.setAttribute('style', 'display:block;');
        app.stopwatch.restartButton.setAttribute('style', 'display:block;');
        app.stopwatch.toggleButton.innerHTML = 'Working';

        app.stopwatch.toggleButton.onclick = app.startCountdownTimer;
        app.stopwatch.restartButton.onclick = app.restartCountdownTimer;

        break;
      case 'enforcer':
        document.body.className = 'enforcer';
        app.stopwatch.message.innerHTML = 'It\'s time to get up and move around!';
        app.stopwatch.toggleButton.setAttribute('style', 'display:none;');
        app.stopwatch.restartButton.setAttribute('style', 'display:none;');

        app.stopwatch.toggleButton.onclick = null;
        app.stopwatch.restartButton.onclick = null;
        break;
      case 'breaksuccess':
        document.body.className = 'break-success';
        app.stopwatch.elem.innerHTML = app.formatTimer(0);
        app.stopwatch.message.innerHTML = 'Thank you! You may return to work.';
        app.stopwatch.toggleButton.setAttribute('style', 'display:block;');
        app.stopwatch.toggleButton.innerHTML = 'Return to Work';

        app.stopwatch.toggleButton.onclick = app.startCountdownTimer;
        break;
    }
  },
  formatTimer: function(time) {
    var _seconds = time / 1000;
    var _hours = Math.floor(_seconds / 3600);
    _seconds -= _hours * 3600;
    var _minutes = Math.floor(_seconds / 60);
    _seconds -= _minutes * 60;

    return app.formatNumber(_hours) + ':' + app.formatNumber(_minutes) + ':' + app.formatNumber(_seconds);
  },
  formatNumber: function(n) {
    var round = Math.floor(n);
    return (round < 10) ? '0' + round : round;
  },
  // deviceready Event Handler
  //
  // The scope of 'this' is the event. In order to call the 'receivedEvent'
  // function, we must explicity call 'app.receivedEvent(...);'
  onDeviceReady: function() {
    app.receivedEvent('received');
    app.watchBeacons();
  },
  // Update DOM on a Received Event
  receivedEvent: function(event) {
    var parentElement = document.getElementById('deviceready');
    var listeningElement = parentElement.querySelector('.listening');
    var receivedElement = parentElement.querySelector('.received');

    listeningElement.setAttribute('style', 'display:none;');
    receivedElement.setAttribute('style', 'display:block;');

    if (event == 'apptokenrequired') {
      receivedElement.innerHTML = 'App token not set'
    } else if (event == 'bluecatspurring') {
      receivedElement.innerHTML = 'Looking for beacons'
    };

    console.log('Received Event: ' + event);
  },
  watchBeacons: function() {
    var watchIdForEnterBeacon,watchIdForExitBeacon,watchIdForClosestBeacon = null;
    var beaconDisplayList = null;

    if (blueCatsAppToken == 'BLUECATS-APP-TOKEN') {
      //BlueCats app token hasn't been configured
      app.receivedEvent('apptokenrequired');
      return;
    }

    var sdkOptions = {
      useLocalStorage:true
    };

    var beaconWatchOptions = {
      filter: {
        //Configure additional filters here e.g.
        //sitesName:['BlueCats HQ', 'Another Site'],
        //categoriesNamed:['Entrance'],
        //maximumAccuracy:0.5
        //etc.
      }
    };

    com.bluecats.beacons.startPurringWithAppToken(
      blueCatsAppToken, purringSuccess, logError, sdkOptions
    );

    function purringSuccess() {
      app.receivedEvent('bluecatspurring');
      watchBeaconEntryAndExit();
      watchClosestBeacon();
    }

    function watchBeaconEntryAndExit() {
      console.log('About to look for beacons');
      console.log('watchIdForEnterBeacon: ' + watchIdForEnterBeacon);
      console.log('watchIdForExitBeacon: ' + watchIdForExitBeacon);
      if (watchIdForEnterBeacon != null) {
        console.log('watchIdForEnterBeacon is not null');
        com.bluecats.beacons.clearWatch(watchIdForEnterBeacon);
      };

      if (watchIdForExitBeacon != null) {
        console.log('watchIdForExitBeacon is not null');
        com.bluecats.beacons.clearWatch(watchIdForExitBeacon);
      };

      watchIdForEnterBeacon = com.bluecats.beacons.watchEnterBeacon(
        function(watchData){
            console.log('Entered watchIdForEnterBeacon!' + watchData);
            displayBeacons('Entered', watchData);

            var breakRoomBeacon = _.find(watchData.filteredMicroLocation.beacons, function(beacon) {
              return beacon.name == 'BeaconBeta';
            });

            var computerBeacon = _.find(watchData.filteredMicroLocation.beacons, function(beacon) {
              return beacon.name == 'USBeecon';
            });

            if (app.stopwatch.state == 'expired' && breakRoomBeacon) {
              console.log('RESTARTING TIMER COS YOU WENT TO THE ROOM');
              app.runBreakMode();
            } else if (app.stopwatch.state == 'breaksuccess' && computerBeacon) {
              console.log('BACK TO THE COMPUTER');
              app.startCountdownTimer();
            }
        }, logError, beaconWatchOptions);
      watchIdForExitBeacon = com.bluecats.beacons.watchExitBeacon(
        function(watchData){
            displayBeacons('Exited', watchData);
        }, logError, beaconWatchOptions);
    }

    function watchClosestBeacon() {
      if (watchIdForClosestBeacon != null) {
        com.bluecats.beacons.clearWatch(watchIdForClosestBeacon);
      };

      watchIdForClosestBeacon = com.bluecats.beacons.watchClosestBeaconChange(
        function(watchData) {
            displayBeacons('Closest to', watchData);
        }, logError, beaconWatchOptions);
    }

    function displayBeacons(description, watchData) {
      var beacons = watchData.filteredMicroLocation.beacons;
      var beaconNames = [];

      for (var i = 0; i < beacons.length; i++) {
        beaconNames.push(beacons[i].name);
      };

      var displayText = description + ' ' + beacons.length + ' beacons: ' + beaconNames.join(',');
      console.log(displayText);

      /*if (!beaconDisplayList) {
        var appElement = document.querySelector('.app');
        beaconDisplayList = document.createElement('ol');
        beaconDisplayList.setAttribute('id', 'beacons');
        appElement.appendChild(beaconDisplayList);
      }

      var li = document.createElement('li');
      li.appendChild(document.createTextNode(displayText));
      beaconDisplayList.appendChild(li);*/
    }

    function logError() {
      console.log('Error occurred watching beacons');
    }
  }
};

app.initialize();
