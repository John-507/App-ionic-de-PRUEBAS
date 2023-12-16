import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { StatusBar, Style, BackgroundColorOptions } from '@capacitor/status-bar';

// Especificar el tipo de navigator como Navigator & { app: any }
declare const navigator: Navigator & { app: any };


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  constructor(private platform: Platform) {

    this.platform.ready().then(async () => {
      // Registrar la acción del botón físico de retroceso
      this.platform.backButton.subscribeWithPriority(10, () => {
        // Salir de la aplicación
        navigator.app.exitApp();
      });
      // Cambiar el estilo de la barra de estado a oscuro
      await this.setStatusBarStyleDark();
    });
    
  }
  async setStatusBarStyleDark() {
    await StatusBar.setStyle({ style: Style.Dark });
    const options: BackgroundColorOptions = {
      color: '#0C419E'
    };
    StatusBar.setBackgroundColor(options);
  };
  
  
}
