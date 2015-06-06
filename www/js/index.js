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
  /* ---------------------------------------------
   *
   *  App initialization
   *
   * -------------------------------------------*/
  initialize: function() {
    this.bindEvents();
    this.initCountdownTimer();
  },
  bindEvents: function() {
    document.addEventListener('deviceready', this.onDeviceReady, false);
  },
  onDeviceReady: function() {
    app.receivedEvent('received');
    app.watchBeacons();
  },

  /* ---------------------------------------------
   *
   *  Countdown timer
   *
   * -------------------------------------------*/
  timer: {
    targetDuration: (1 * 60 * 1000), // Minutes * 60 * 1000
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
  initCountdownTimer: function() {
    app.timer.elem = document.getElementById('timer');
    app.timer.toggleButton = document.getElementById('toggleButton');
    app.timer.restartButton = document.getElementById('restartButton');
    app.timer.message = document.getElementById('message');
    app.timer.state = 'ready';

    app.setTimerState('ready');
  },
  startCountdownTimer: function() {
    app.timer.initialCount = (new Date).getTime();
    app.timer.currentCount = app.timer.initialCount;
    app.timer.targetCount = app.timer.initialCount + app.timer.targetDuration;
    app.timer.state = 'running';

    app.setTimerState('running');
    app.countdown();
  },
  restartCountdownTimer: function() {
    clearTimeout(app.timer.timeout);
    app.timer.state = 'ready';

    app.setTimerState('ready');
  },
  runBreakMode: function() {
    clearTimeout(app.timer.timeout);
    app.timer.state = 'breaksuccess';

    app.setTimerState('breaksuccess');
  },
  countdown: function() {
    app.timer.currentCount = (new Date).getTime();

    var timeLeft = app.timer.targetCount - app.timer.currentCount; 

    if (timeLeft <= 0) {
      app.setTimerState('enforcer');
      app.timer.state = 'expired';
      clearTimeout(app.timer.timeout);
    } else {
      app.timer.timeout = setTimeout(app.countdown, 500); // Check every 500 milliseconds
      
      app.timer.elem.innerHTML = app.formatTimer(timeLeft);
    }
  },
  setTimerState: function(state) {
    switch (state) {
      case 'ready':
        document.body.className = '';
        app.timer.elem.innerHTML = app.formatTimer(0);
        app.timer.message.innerHTML = 'Click "Start Work" to begin timing your hour of solid work.';
        app.timer.toggleButton.setAttribute('style', 'display:block;');
        app.timer.restartButton.setAttribute('style', 'display:block;');
        app.timer.toggleButton.innerHTML = 'Start Work';
        app.timer.restartButton.innerHTML = 'Reset Timer';

        app.timer.toggleButton.onclick = app.startCountdownTimer;
        app.timer.restartButton.onclick = app.restartCountdownTimer;

        break;
      case 'running':
        document.body.className = 'running';
        app.timer.message.innerHTML = 'Time to work away and be productive! Go go go!';
        app.timer.toggleButton.setAttribute('style', 'display:block;');
        app.timer.restartButton.setAttribute('style', 'display:block;');
        app.timer.toggleButton.innerHTML = 'Working';

        app.timer.toggleButton.onclick = app.startCountdownTimer;
        app.timer.restartButton.onclick = app.restartCountdownTimer;

        break;
      case 'enforcer':
        document.body.className = 'enforcer';
        app.timer.message.innerHTML = 'It\'s time to get up and move around!';
        app.timer.toggleButton.setAttribute('style', 'display:none;');
        app.timer.restartButton.setAttribute('style', 'display:none;');

        app.timer.toggleButton.onclick = null;
        app.timer.restartButton.onclick = null;
        break;
      case 'breaksuccess':
        document.body.className = 'break-success';
        app.timer.elem.innerHTML = app.formatTimer(0);
        app.timer.message.innerHTML = 'Thank you! You may return to work.';
        app.timer.toggleButton.setAttribute('style', 'display:block;');
        app.timer.toggleButton.innerHTML = 'Return to Work';

        app.timer.toggleButton.onclick = app.startCountdownTimer;
        break;
    }
  },
  formatTimer: function(time) {
    var seconds = time / 1000;
    var hours = Math.floor(seconds / 3600);
    seconds -= hours * 3600;
    var minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;

    return app.formatNumber(hours) + ':' + app.formatNumber(minutes) + ':' + app.formatNumber(seconds);
  },
  formatNumber: function(n) {
    var round = Math.floor(n);
    return (round < 10) ? '0' + round : round;
  },

  /* ---------------------------------------------
   *
   *  BlueCat Beacon magic
   *
   * -------------------------------------------*/
  receivedEvent: function(event) {
    var parentElement = document.getElementById('deviceready'),
        listeningElement = parentElement.querySelector('.listening'),
        receivedElement = parentElement.querySelector('.received');

    listeningElement.setAttribute('style', 'display:none;');
    receivedElement.setAttribute('style', 'display:block;');

    if (event == 'apptokenrequired') {
      receivedElement.innerHTML = 'App token not set'
    } else if (event == 'bluecatspurring') {
      // We are on the look out for beacons
      receivedElement.setAttribute('style', 'display:none;');
    };

    console.log('Received Event: ' + event);
  },
  watchBeacons: function() {
    var watchIdForEnterBeacon = null;

    if (blueCatsAppToken == 'BLUECATS-APP-TOKEN') {
      //BlueCats app token hasn't been configured
      app.receivedEvent('apptokenrequired');
      return;
    }

    var sdkOptions = {
      useLocalStorage: true
    };

    var beaconWatchOptions = {
      minimumTriggerIntervalInSeconds: 5,
      filter: {}
    };

    function purringSuccess() {
      app.receivedEvent('bluecatspurring');
      watchBeaconEntry();
    }

    function watchBeaconEntry() {
      if (watchIdForEnterBeacon != null) {
        com.bluecats.beacons.clearWatch(watchIdForEnterBeacon);
      };

      watchIdForEnterBeacon = com.bluecats.beacons.watchEnterBeacon(
        function(watchData){
            displayBeacons('Entered', watchData);

            var breakRoomBeacon = _.find(watchData.filteredMicroLocation.beacons, function(beacon) {
              return beacon.name == 'BeaconBeta';
            });

            var computerBeacon = _.find(watchData.filteredMicroLocation.beacons, function(beacon) {
              return beacon.name == 'USBeecon';
            });

            // Room was entered, break successful
            if (app.timer.state == 'expired' && breakRoomBeacon) {
              app.runBreakMode();
            }
            // Back at the computer
            else if (app.timer.state == 'breaksuccess' && computerBeacon) {
              app.startCountdownTimer();
            }
        }, logError, beaconWatchOptions);
    }

    com.bluecats.beacons.startPurringWithAppToken(
      blueCatsAppToken, purringSuccess, logError, sdkOptions
    );

    function displayBeacons(description, watchData) {
      var beacons = watchData.filteredMicroLocation.beacons;
      var beaconNames = [];

      for (var i = 0; i < beacons.length; i++) {
        beaconNames.push(beacons[i].name);
      };

      var displayText = description + ' ' + beacons.length + ' beacons: ' + beaconNames.join(',');
      console.log(displayText);
    }

    function logError() {
      console.log('Error occurred watching beacons');
    }
  }
};

app.initialize();