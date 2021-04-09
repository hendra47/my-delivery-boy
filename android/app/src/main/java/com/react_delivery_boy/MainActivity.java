package com.react_delivery_boy;

import com.facebook.react.ReactActivity;
import android.os.Bundle; // here
import org.devio.rn.splashscreen.SplashScreen; // here
public class MainActivity extends ReactActivity {
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    SplashScreen.show(this, R.style.SplashTheme);  // here
    super.onCreate(savedInstanceState);
  }
  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "Deliverybuddy";
  }
}
