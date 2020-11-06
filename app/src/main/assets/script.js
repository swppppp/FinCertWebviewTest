const IOS_APP = "iOSAPP";
const ANDROID_APP = "androidAPP";

var initParam = {};
var appInfo;


// ////////////////////////////////////////////////////////
// 1. SDK 로드
// ////////////////////////////////////////////////////////

// 앱에서 호출해야 하는 함수
function loadSdk(_appInfo) {
  // 앱정보 할당
  appInfo = _appInfo;
  var _scriptElem = document.createElement('script');
  _scriptElem.src = SDK_URL + getYYYYMMDD();
  _scriptElem.id = "fincertSdk";
  document.querySelector('body').appendChild(_scriptElem);
  _scriptElem.onerror = loadSdk_FailCallback;
  _scriptElem.onload = loadSdk_SucCallback;
}

function loadSdk_SucCallback() {
  if (appInfo == IOS_APP) {
    // iOS userContentController:didReceiveScriptMessage 호출(네이티브로 정보 전달)
	webkit.messageHandlers.loadSdk_Success.postMessage("SUCCESS");
  } else if (appInfo == ANDROID_APP) {
    // android javascript interface 호출(네이티브로 정보 전달)
    yeskeyAndroid.sendMessage("SUCCESS");
  } else { 
    // 웹 브라우저인 경우 처리
    // initSDK(initParamStr);
  }
}

function loadSdk_FailCallback(_error) {
  if (appInfo == IOS_APP) {
    // iOS userContentController:didReceiveScriptMessage 호출(네이티브로 정보 전달)
    webkit.messageHandlers.loadSdk_Failure.postMessage(makeFailMsg(_error));
  } else if (appInfo == ANDROID_APP) {
    // android javascript interface 호출(네이티브로 정보 전달)
    yeskeyAndroid.sendMessage(makeFailMsg(_error));
  } else {
    // 웹 브라우저인 경우 처리
    // failCallback(_error);
  }
}

function getYYYYMMDD() {
  var _date = new Date();
  var _year = _date.getFullYear();
  var _month = new String(_date.getMonth() + 1);
  var _day = new String(_date.getDate());
  if (_month.length == 1) {
    _month = "0" + _month;
  }
  if (_day.length == 1) {
    _day = "0" + _day;
  }
  return _year + _month + _day;
}


// ////////////////////////////////////////////////////////
// 2. SDK 초기화
// ////////////////////////////////////////////////////////

// EXPORT - 앱에서 호출해야 하는 함수
function initSdk(_paramStr) {
  initParam = JSON.parse(_paramStr);

  initParam.success = initSdk_SucCallback;
  initParam.fail = initSdk_FailCallback;

  _init();
}

function initSdk_SucCallback() {
  if (appInfo == IOS_APP) {
    // iOS userContentController:didReceiveScriptMessage 호출(네이티브로 정보 전달)
    webkit.messageHandlers.initSdk_Success.postMessage("SUCCESS");
  } else if (appInfo == ANDROID_APP) {
    // android javascript interface 호출(네이티브로 정보 전달)
    yeskeyAndroid.sendMessage("SUCCESS");
  } else {
    // 웹 브라우저인 경우
    // alert("초기화가 성공적으로 완료 되었습니다.");
  }
}

function initSdk_FailCallback(_error) {
  if (appInfo == IOS_APP) {
    // iOS userContentController:didReceiveScriptMessage 호출(네이티브로 정보 전달)
    webkit.messageHandlers.initSdk_Failure.postMessage(makeFailMsg(_error));
  } else if (appInfo == ANDROID_APP) {
    // android javascript interface 호출(네이티브로 정보 전달)
    yeskeyAndroid.sendMessage(makeFailMsg(_error));
  } else { // 웹 브라우저인 경우
    // failCallback(_error);
  }
}

var FinCert;
function _init() {
  if (!FinCert) {
    setTimeout(_init, 200);
    return;
  }
  FinCert.Sdk.init(initParam);
}

//////////////////////////////////////////////////////////
// 오류 메시지 구성
//////////////////////////////////////////////////////////

function makeFailMsg(_error) {
  var _failMsg = 'error.message: ' + _error.message + '|' + 'error.code: ' + _error.code;
  return _failMsg;      
}  