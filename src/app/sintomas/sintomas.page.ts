import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from './../servicio/api.service';
import { LoadingController, NavController, IonContent } from '@ionic/angular';

let lastScroll = 0;
let timerId: ReturnType<typeof setTimeout>;


@Component({
  selector: 'app-sintomas',
  templateUrl: './sintomas.page.html',
  styleUrls: ['./sintomas.page.scss'],
})
export class SintomasPage implements OnInit {

  sintomas: any[] = [];

  seleccionados: any = {};
  termino: string = '';
  sintomasFiltrados: any[] = [];

  @ViewChild(IonContent, { static: false }) content: IonContent | undefined;
  showScrollTop: boolean = false;
  showScrollBottom: boolean = false;
  
  constructor(
    private api: ApiService,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    
  }
  ionViewWillEnter() {
    this.cargarSintomas();
  }

  async cargarSintomas() {
    // Muestra un indicador de carga mientras se obtienen los síntomas
    const loading = await this.loadingCtrl.create({
      message: 'Cargando síntomas...!'
    });
    await loading.present();

    // llama al método del servicio para obtener los síntomas
    this.api.obtenerSintomas().subscribe(sintomas => {
      // Asigna los síntomas obtenidos al array 'sintomas'
      this.sintomas = sintomas;
      this.sintomasFiltrados = sintomas;
      this.restablecerSeleccion();
      console.log('Lista de síntomas:', this.sintomas);
      //oculta el indicador de carga
      loading.dismiss();
    }, err => {
      // Maneja el error si existe
      console.error('Error al cargar los sintomas:', err);
      loading.dismiss();
    });
  }

  restablecerSeleccion() {
    this.seleccionados = {};
    this.sintomas.forEach(sintoma => {
      sintoma.seleccionado = false;
    });
    this.sintomasFiltrados = [...this.sintomas];
  }

  cambiarSeleccion(sintomaId: number, valor: boolean) {
    this.seleccionados[sintomaId] = valor;
    // Actualiza la lista de síntomas filtrados para reflejar el estado de los checkboxes
    this.sintomasFiltrados = this.sintomasFiltrados.map(sintoma => {
      sintoma.seleccionado = this.seleccionados[sintoma.id];
      return sintoma;
    });
  }

  async enviar() {
    const loading = await this.loadingCtrl.create({
      message: 'Enviando datos...'
    });
    await loading.present();

    const sintomasIds = Object.keys(this.seleccionados).filter(key => this.seleccionados[key]);

    const sintomasNombres = sintomasIds.map(id => {
      const sintoma = this.sintomas.find(s => s.id === Number(id));
      return sintoma ? sintoma.nombre : null;
    }).filter(nombre => nombre !== null);

    this.api.diagnosticar(sintomasNombres).subscribe(res => {
      loading.dismiss();
      this.navCtrl.navigateForward(['/resultados'], {
        queryParams: { diagnostico: JSON.stringify(res) }
      });
    }, err => {
      console.error('Error al enviar los síntomas:', err);
      loading.dismiss();
    });
  }

  buscar() {
    if (this.termino === '') {
      this.sintomasFiltrados = this.sintomas;
    } else {
      const resultados = this.sintomas.filter(sintoma =>
        sintoma.nombre.toLowerCase().includes(this.termino.toLowerCase())
      );
      this.sintomasFiltrados = resultados.sort((a, b) => {
        return a.nombre.toLowerCase().indexOf(this.termino.toLowerCase()) -
          b.nombre.toLowerCase().indexOf(this.termino.toLowerCase());
      });
    }
  }

  doRefresh(event: any) {
    this.cargarSintomas().then(() => {
      event.target.complete();
    });
  }

  logScrollStart(event: any) {
    console.log("logScrollStart");
  }

  logScrolling(event: any) {
    console.log("logScrolling= " + event.detail.currentY);
    let currentScroll = event.detail.currentY; // Variable local para guardar el valor actual del scroll
    if (event && currentScroll > lastScroll) {
      // El usuario se está desplazando hacia abajo
      this.showScrollTop = false; // Ocultar el botón para ir al inicio
      this.showScrollBottom = true; // Mostrar el botón para ir al final
    } else if (event && currentScroll < lastScroll) {
      // El usuario se está desplazando hacia arriba
      this.showScrollTop = true; // Mostrar el botón para ir al inicio
      this.showScrollBottom = false; // Ocultar el botón para ir al final
    }
    lastScroll = currentScroll;
  }

  logScrollEnd(event: any) {
    //console.log("logScrollEnd")
    clearTimeout(timerId); // Cancelar el temporizador anterior si existe
    timerId = setTimeout(() => { // Asignar el nuevo temporizador a la variable global
      this.showScrollTop = false; // Ocultar el botón para ir al inicio
      this.showScrollBottom = false; // Ocultar el botón para ir al final
    }, 5000);
  }

  ScrollToTop() {
    this.content?.scrollToTop(1500)
  }

  ScrollToBottom() {
    this.content?.scrollToBottom(1500)
  }
}
