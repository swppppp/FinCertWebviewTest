package com.example.fincertwebviewtest

import android.content.SharedPreferences
import android.log.Log
import android.os.Bundle
import android.util.Base64
import android.webkit.WebView
import androidx.appcompat.app.AppCompatActivity
import androidx.databinding.DataBindingUtil
import com.example.fincertwebviewtest.databinding.ActivityMainBinding
import java.util.*

const val ANDROID_APP = "androidAPP"
class MainActivity : AppCompatActivity() {

    private lateinit var mainBinding : ActivityMainBinding
    lateinit var webView:WebView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        mainBinding = DataBindingUtil.setContentView(this, R.layout.activity_main)
//        setContentView(R.layout.activity_main)

    }

    // 초기화 parameter (Json String)
    var _paramStr: String? = genSdkInitParam()

    /**
     * JavaScript load 함수 호출
     */
    private fun loadSdk() {
        webView.evaluateJavascript("loadSdk('$ANDROID_APP')", null)
    }

    /**
     * JavaScript init 함수 호출
     */
    private fun initSdk() {
        webView.evaluateJavascript("initSDK('$_paramStr')", null)
    }

    /**
     * JavaScript 초기화 파라미터 반환
     * @return pramString
     */
    private fun genSdkInitParam(): String? {
        var param = LinkedHashMap<String, String>()
        param["orgCode"] = "0099"
        param["apiKey"] = "a121b24e58d348fb123a912c3"
        param["clientOrigin"] = this.packageName
        param["uniqVal"] = getUniqueValue()
        param["lang"] = "kor"
        try {
            return jsonMapper.writeValueAsString(param)
        } catch (e: java.lang.Exception) {
            Log.d("LOG_TAG", "SDK 초기화 파라미터 생성 실패 ")
        }
        return null
    }

    /**
     * androidKeyStore를 사용하여 안전하게 관리되는 UniqueValue 반환
     * 앱내에 Base64 인코딩하여 저장한 데이터를 바이너리 androidKeystore를 사용해 암/복호화하여 관리
     * @return UUID string
     */
    private fun getUniqueValue(): String? {
        val preferences: SharedPreferences =
            this.getSharedPreferences("com.yeskey.certapi.yeskeyBank", context.MODE_PRIVATE)
        val UNIQUE_VAL = "UNIQUE_VAL"
        val androidKeyStore: KeyStoreUtil
        try {
            androidKeyStore = KeyStoreUtil(context.getApplicationContext())
            return if (preferences.contains(UNIQUE_VAL)) {
                val encryptedVal: ByteArray =
                    Base64.decode(preferences.getString(UNIQUE_VAL, ""), Base64.DEFAULT)
                String(androidKeyStore.decrypt(encryptedVal), "UTF-8")
            } else {
                //UUID 생성
                val uniqueVal: String = UUID.randomUUID().toString()
                val encryptedVal: ByteArray =
                    androidKeyStore.encrypt(uniqueVal.toByteArray(charset("UTF-8")))
                preferences.edit()
                    .putString(UNIQUE_VAL, Base64.encodeToString(encryptedVal, Base64.DEFAULT))
                    .commit()
                uniqueVal
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
        return null
    }

}