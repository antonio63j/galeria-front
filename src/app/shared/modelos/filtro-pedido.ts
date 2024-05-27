export class FiltroPedido {

        page: string;
        size: string;
        order: string;
        direction: string;

        estado: string;
        diaRegistroIni: Date;
        diaRegistroFin: Date;
        diaEntregaIni: Date;
        horaEntregaIni: string;
        diaEntregaFin: Date;
        horaEntregaFin: string;
        entregaPedido: string;
        usuario: string;

        constructor() {
           this.init();
           this.initPage('0', '10', 'fechaEntrega', 'asc');
        }

        init(): void{
            this.diaRegistroIni = null;
            this.diaRegistroFin = null;
            this.diaEntregaIni = new Date();
            this.diaEntregaIni.setHours(0, 0, 0);
            this.horaEntregaIni = '00:00';
            this.diaEntregaFin = new Date();
            this.diaEntregaFin.setHours(23 , 59, 59);
            this.horaEntregaFin = '23:59';
            this.entregaPedido = null;
            this.estado = null;
            this.usuario = null;

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
