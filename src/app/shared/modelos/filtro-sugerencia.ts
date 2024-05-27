export class FiltroSugerencia {
    page: string;
    size: string;
    order: string;
    direction: string;
    precioMin: string;
    precioMax: string;
    label: string;
    tipo: string;
    descripcion: string;
    visible?: string;

    constructor(size?: number) {
       if (size === undefined){
           size = 10;
       }
       this.init();
       //  this.initPage('0', '10', 'label', 'asc');
       this.initPage('0', size.toString(), 'label', 'asc');

    }

    init(): void{
        this.precioMin = null;
        this.precioMax = null;
        this.label = null;
        this.tipo = null;
        this.descripcion = null;
    }

    setSoloVisibles(): void {
        this.visible = 'si';
    }

    initPage(page: string,
             size: string,
             order: string,
             direction: string): void{
      this.page = page;
      this.size = size;
      this.order = order;
      this.direction = direction;
    }
}

export class OrdenLoteSugerencia {
    order: string;
    direction: string;

    constructor() {
       this.initPage('label', 'asc');
    }

    initPage(order: string,
             direction: string): void{
      this.order = order;
      this.direction = direction;
    }
}