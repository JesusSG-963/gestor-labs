import { Component } from '@angular/core';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { NotificationsService } from './services/notifications.service';
//
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'gestor-labs';

  readonly VAPID_PUBLIC_KEY = "BEt6MuXMLLtjR58VB3bnPWmyOY3CjWQcGC3szzIAv3FXSxHPL2ReCsNRXUSRJHtFsIN2IbYDObJvkMBV1GgkqF8";

    constructor(
        private swPush: SwPush,
        private swUpdate: SwUpdate,
        private noti_serv:NotificationsService) {

          this.updateClient();
        }

  ngOnInit() {


    this.swPush.messages.subscribe((message) => {
      console.warn(message);

      let msg = message['notification'];

      Swal.fire({
        position: 'top-end',
        icon: 'info',
        title: msg['title'],
        text: msg['message'],
        showConfirmButton: false,
        timer: 3500
      })

    });

    this.swPush.notificationClicks.subscribe(({action, notification}) => {
      window.open(notification.data.url);
    })

    // this.swPush.subscription.subscribe((message) => {
    //   console.warn(message);
      
    // });
    

    this.getSuscriptionsWebPush();
  
  }

  getSuscriptionsWebPush(){


    console.log("Registrando....");

    this.swPush.requestSubscription({
        serverPublicKey: this.VAPID_PUBLIC_KEY
    })
    .then((sub) =>{ 
      
        console.error(sub);
      

        this.noti_serv.notificationsPush(JSON.stringify(sub)).subscribe((res)=>{

          console.error(res);
        
    
        })
    
      }
    
    )
    .catch(err => console.error("Could not subscribe to notifications", err));


  }

  updateClient(){
    if (this.swUpdate.isEnabled) {

      this.swUpdate.available.subscribe(() => {

          if (confirm("New version available. Load New Version?")) {
              window.location.reload();
          }

      });

    }
  }

}
