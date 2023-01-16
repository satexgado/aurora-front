import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { environment } from '../../../environments/environment';
@Injectable()
export class EnvironmentService {
	
	apiUrl = environment.api_url+'/';

  	constructor(private http: HttpClient) { }

  	setApiService(serviceStr){
	    return this.apiUrl +'api/'+ serviceStr
	}
	setApiServiceWithPage(serviceStr, pageNo){
	    return this.apiUrl +'api/'+ serviceStr +'?page='+ pageNo
	}
	setApiServiceById(serviceStr, id){
	    return this.apiUrl +'api/'+ serviceStr +'/'+ id
	}
	setAuthService(serviceStr){
	    return this.apiUrl +'auth/'+ serviceStr
	}
	setAuthServiceById(serviceStr, id){
	    return this.apiUrl +'auth/'+ + serviceStr +'/'+ id
	}
	setLoginJson(loginData) {
		let formObject = loginData
		formObject.client_secret = environment.clientSecret
		formObject.grant_type = environment.grantType
		formObject.client_id = environment.clientId
		return formObject
	}

}
