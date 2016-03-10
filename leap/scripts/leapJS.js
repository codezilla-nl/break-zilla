// Store frame for motion functions
var previousFrame = null;
var paused = false;
var pauseOnGesture = false;

// Setup Leap loop with frame callback function
var controllerOptions = {enableGestures: true};

// to use HMD mode:
// controllerOptions.optimizeHMD = true;

Leap.loop(controllerOptions, function(frame) {
  if (paused) {
    return; // Skip this update
  }

  // Display Frame object data
  var frameOutput = document.getElementById("frameData");

  var frameString = {
    id: frame.id,
    Timestamp: frame.timestamp,
    Hands: frame.hands.length,
    Fingers: frame.fingers.length,
    Tools: frame.tools.length,
    Gestures: frame.gestures.length
  }

  // Frame motion factors
  if (previousFrame && previousFrame.valid) {
    var translation = frame.translation(previousFrame);
    frameString['Translation'] = vectorToString(translation);

    var rotationAxis = frame.rotationAxis(previousFrame);
    var rotationAngle = frame.rotationAngle(previousFrame);
    frameString['RotationAxis'] = vectorToString(rotationAxis, 2);
    frameString['RotationAngle'] = rotationAngle.toFixed(2);

    var scaleFactor = frame.scaleFactor(previousFrame);
    frameString['ScaleFactor'] = scaleFactor.toFixed(2);
  }
  frameOutput.innerHTML = "<div style='width:300px; float:left; padding:5px'>" + JSON.stringify(frameString) + "</div>";

  // Display Hand object data
  var handOutput = document.getElementById("handData");
  var handString = {};
  if (frame.hands.length > 0) {
    for (var i = 0; i < frame.hands.length; i++) {
      var hand = frame.hands[i];

      handString["ID"] = hand.id;
      handString["Type"] = hand.type;
      handString["direction"] = hand.direction;
      // handString["PalmPosition"] = vectorToString(hand.palmPosition);
      // handString["GrabStrength"] = hand.grabStrength;
      // handString["PinchStrength"] = hand.pinchStrength;
      // handString["Confidence"] = hand.confidence;
      // handString["ArmDirection"] = vectorToString(hand.arm.direction());
      // handString["ArmCenter"] = vectorToString(hand.arm.center());
      // handString["ArmUpVector"] = vectorToString(hand.arm.basis[1]);

      // Hand motion factors
      // if (previousFrame && previousFrame.valid) {
      //   var translation = hand.translation(previousFrame);
      //   handString["Translation"] = vectorToString(translation);

      //   var rotationAxis = hand.rotationAxis(previousFrame, 2);
      //   var rotationAngle = hand.rotationAngle(previousFrame);
      //   handString["RotationAxis"] = vectorToString(rotationAxis);
      //   handString["RotationAngle"] = rotationAngle.toFixed(2);

      //   var scaleFactor = hand.scaleFactor(previousFrame);
      //   handString["ScaleFactor"] = scaleFactor.toFixed(2);
      // }

      // IDs of pointables associated with this hand
      if (hand.pointables.length > 0) {
        var fingerIds = [];
        for (var j = 0; j < hand.pointables.length; j++) {
          var pointable = hand.pointables[j];
            fingerIds.push(pointable.id);
        }
        if (fingerIds.length > 0) {
          handString["FingersIDs"] = fingerIds.join(", ");
        }
      }
    }
  }
  else {
    handString = {No: "hands"};
  }
  handOutput.innerHTML = JSON.stringify(handString);

  if (handString.direction) {
    var lowest = document.getElementById('lowest');
    var highest = document.getElementById('highest');
    if (Number(handString.direction[0]) < Number(lowest.innerHTML)) {
      lowest.innerHTML = handString.direction[0];
    }
    if (Number(handString.direction[0]) > Number(highest.innerHTML)) {
      highest.innerHTML = handString.direction[0];
    }

    var handle = document.querySelector('.slider--handle');
    handle.style.left = (handString.direction[0] * 75) + 30 + "%"; //offset 30%, multiply by 75% (would expect best results)
  }

  // Display Pointable (finger and tool) object data
  var pointableOutput = document.getElementById("pointableData");
  var pointableString = {};
  if (frame.pointables.length > 0) {
    var fingerTypeMap = ["Thumb", "Index finger", "Middle finger", "Ring finger", "Pinky finger"];
    var boneTypeMap = ["Metacarpal", "Proximal phalanx", "Intermediate phalanx", "Distal phalanx"];
    for (var i = 0; i < frame.pointables.length; i++) {
      var pointable = frame.pointables[i];

      if (pointable.tool) {
        pointableString["PointableID"] = pointable.id;
        pointableString["Length"] = pointable.length.toFixed(1);
        pointableString["Width"] = pointable.width.toFixed(1);
        pointableString["Direction"] = vectorToString(pointable.direction, 2);
        pointableString["Tip position"] = vectorToString(pointable.tipPosition);
      }
      else {
        pointableString["PointableID"] = pointable.id;
        pointableString["Type"] = fingerTypeMap[pointable.type];
        pointableString["BelongsToHandWithID"] = pointable.handId;
        pointableString["Length"] = pointable.length.toFixed(1);
        pointableString["Width"] = pointable.width.toFixed(1);
        pointableString["Direction"] = vectorToString(pointable.direction, 2);
        pointableString["Extended"] = pointable.extended;
        
        pointable.bones.forEach( function(bone){
          pointableString["boneTypeMap"] = boneTypeMap[bone.type];
          pointableString["Center"] = vectorToString(bone.center());
          pointableString["Direction"] = vectorToString(bone.direction());
          pointableString["UpVector"] = vectorToString(bone.basis[1]);
        });
        pointableString["TipPosition"] = vectorToString(pointable.tipPosition);
      }
    }
  }
  else {
    pointableString = {No: "pointables"};
  }
  pointableOutput.innerHTML = JSON.stringify(pointableString);

  // Display Gesture object data
  var gestureOutput = document.getElementById("gestureData");
  var gestureString = {};
  if (frame.gestures.length > 0) {
    if (pauseOnGesture) {
      togglePause();
    }
    for (var i = 0; i < frame.gestures.length; i++) {
      var gesture = frame.gestures[i];
      gestureString["GestureID"] = gesture.id;
      gestureString["type"] = gesture.type;
      gestureString["state"] = gesture.state;
      gestureString["handIDs"] = gesture.handIds.join(", ");
      gestureString["pointableIDs"] = gesture.pointableIds.join(", ");
      gestureString["duration"] = gesture.duration;

      switch (gesture.type) {
        case "circle":
          gestureString["center"] = vectorToString(gesture.center);
          gestureString["normal"] = vectorToString(gesture.normal, 2);
          gestureString["radius"] = gesture.radius.toFixed(1);
          gestureString["progress"] = gesture.progress.toFixed(2);
          break;
        case "swipe":
          gestureString["startPosition"] = vectorToString(gesture.startPosition);
          gestureString["currentPosition"] = vectorToString(gesture.position);
          gestureString["direction"] = vectorToString(gesture.direction, 1);
          gestureString["speed"] = gesture.speed.toFixed(1);
          break;
        case "screenTap":
        case "keyTap":
          gestureString["position"] = vectorToString(gesture.position);
          break;
        default:
          gestureString = {"unkown": "gesture type"};
      }
    }
  gestureOutput.innerHTML = JSON.stringify(gestureString);
  }
  else {
    // gestureString += "No gestures";
  }
  // gestureOutput.innerHTML = gestureString;

  // Store frame for motion functions
  previousFrame = frame;
})

function vectorToString(vector, digits) {
  if (typeof digits === "undefined") {
    digits = 1;
  }
  return "(" + vector[0].toFixed(digits) + ", "
             + vector[1].toFixed(digits) + ", "
             + vector[2].toFixed(digits) + ")";
}

function togglePause() {
  paused = !paused;

  if (paused) {
    document.getElementById("pause").innerText = "Resume";
  } else {
    document.getElementById("pause").innerText = "Pause";
  }
}

function pauseForGestures() {
  if (document.getElementById("pauseOnGesture").checked) {
    pauseOnGesture = true;
  } else {
    pauseOnGesture = false;
  }
}
