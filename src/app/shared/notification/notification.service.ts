import { Injectable } from '@angular/core';
import {SnotifyService, SnotifyPosition, SnotifyToastConfig} from 'ng-snotify';

@Injectable()
export class NotificationService {
	style = 'material';
	title = '';
	body = '';
	timeout = 3000;
	position: SnotifyPosition = SnotifyPosition.rightTop;
	progressBar = true;
	closeClick = true;
	newTop = true;
	backdrop = -1;
	dockMax = 8;
	blockMax = 6;
	pauseHover = true;
	titleMaxLength = 40;
	bodyMaxLength = 1000;

	constructor(private snotifyService: SnotifyService) { }

	// Notification Config
   	getConfig(): SnotifyToastConfig {
	    this.snotifyService.setDefaults({
	    	global: {
	        	newOnTop: this.newTop,
	        	maxAtPosition: this.blockMax,
	        	maxOnScreen: this.dockMax,
	      	}
	    });
	 	return {
	      	bodyMaxLength: this.bodyMaxLength,
	      	titleMaxLength: this.titleMaxLength,
	      	backdrop: this.backdrop,
	      	position: this.position,
	      	timeout: this.timeout,
	      	showProgressBar: this.progressBar,
	      	closeOnClick: this.closeClick,
	      	pauseOnHover: this.pauseHover
	    };
	}

	// On Success
	onSuccess($body, $title = 'Success') {
    	this.snotifyService.success($body, $title, this.getConfig());
  	}

  	// On Info
  	onInfo($body, $title = 'Information') {
    	this.snotifyService.info($body, $title, this.getConfig());
  	}

  	// On Error
  	onError($body, $title = 'Erreur') {
    	this.snotifyService.error($body, $title, this.getConfig());
  	}

  	// On Warning
  	onWarning($body, $title = 'Warning') {
    	this.snotifyService.warning($body, $title, this.getConfig());
  	}

    onCancel(callback = ()=>{}, body, title, type = 'success', text = 'Annuler') {

      switch(type) {
        case  'error':
        this.snotifyService.error(body, title,
          {...this.getConfig(),
			timeout: 10000,
            buttons: [
              {text: text, action: (toast) => {
                // callback();
                this.snotifyService.remove(toast.id);
                this.position = SnotifyPosition.rightTop;
              }, bold: false}
            ]
          }
          ).on( "click", () => {
			callback();
		  });
          break;
          default:
          this.snotifyService.success(body, title,
            {...this.getConfig(),
			  timeout: 10000,
              buttons: [
                {text: text, action: (toast) => {
                //   callback();
                  this.snotifyService.remove(toast.id);
                  this.position = SnotifyPosition.rightTop;
                }, bold: false}
              ]
            }
            ).on( "click", () => {
				callback();
			});
      }
    }

  	onConfirmation(yesAction, noAction = ()=>{}) {
    	this.position = SnotifyPosition.centerCenter;
    	const {timeout, closeOnClick, ...config} = this.getConfig(); // Omit props what i don't need
	    this.snotifyService.confirm(this.body, this.title, {
	      	...config,
	      	buttons: [
	        	{text: 'Oui', action: (toast) => {
              yesAction();
              this.snotifyService.remove(toast.id);
              this.position = SnotifyPosition.rightTop;
            }, bold: false},
	        	{text: 'Non', action: (toast) => {
              noAction();
              this.snotifyService.remove(toast.id)
              this.position = SnotifyPosition.rightTop;
            }, bold: true},
	      	]
			});
	}

	onChoose(options: {text:string, option: any}[], body: string, title: string)
	{
		let optionsArray = [];

		options.forEach(element => {
			let button = {text: element.text, option: (toast) => {
				element.option();
				this.snotifyService.remove(toast.id);
				this.position = SnotifyPosition.rightTop;
			}, bold: false};
			optionsArray.push(button);
		});

		optionsArray.push({text: 'Annuler', action: (toast) => {
			this.snotifyService.remove(toast.id)
			this.position = SnotifyPosition.rightTop;
		}, bold: true})

		this.position = SnotifyPosition.centerCenter;
    	const {timeout, closeOnClick, ...config} = this.getConfig(); // Omit props what i don't need
	    this.snotifyService.confirm(body, title, {
	      	...config,
	      	buttons: optionsArray
			});
	}

}
