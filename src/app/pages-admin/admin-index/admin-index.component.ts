import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { map, takeUntil, tap } from 'rxjs/operators';
import swal from 'sweetalert2';
import { AdminIndex } from '../../shared/modelos/admin-index';
import { AdminIndexService } from './admin-index.service';
import { environment } from 'src/environments/environment';
import { ShowErrorService } from 'src/app/shared/services/show-error.service';

@Component({
  selector: 'app-admin-index',
  templateUrl: './admin-index.component.html',
  styleUrls: ['./admin-index.component.scss']
})
export class AdminIndexComponent implements OnInit, OnDestroy {

  private observ$: Subscription = null;
  private unsubscribe$ = new Subject<void>();

  public adminIndexList: AdminIndex[] = [];
  host: string = environment.urlEndPoint;

  constructor(
    private adminIndexService: AdminIndexService,
    private showErrorService: ShowErrorService
  ) { }

  ngOnInit(): void {
    this.cargaAdminIdex();
  }

  cargaAdminIdex(): void {

    this.observ$ = this.adminIndexService
      .getAdminIndex()
      .pipe(
        takeUntil(this.unsubscribe$),
        tap((response: any) => {
        }),
        map((response: any) => {
          (response as AdminIndex[]).map(admin => {
            admin.cabecera = admin.cabecera.toUpperCase();
            return admin;
          });
          return response;
        })
      )
      .subscribe(
        response => {
          // console.log(response);
          this.adminIndexList = response as AdminIndex[];
        }
        , err => this.showErrorService.httpErrorResponse(err, 'Carga opciones de administración', '', 'error')
      );
  }

  ngOnDestroy(): void {
    console.log('realizando unsubscribes');
    this.unsubscribe$.next();
    this.unsubscribe$.complete();

    if (this.observ$ != null && !this.observ$.closed) {
      console.log('haciendo : this.observ$.unsubscribe()');
      this.observ$.unsubscribe();
    } else {
      console.log('No necesario hacer: this.observ$.unsubscribe()');
    }
  }
}
