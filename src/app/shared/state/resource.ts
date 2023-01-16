import { Factory, ListResult } from './factory';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { QueryOptions } from '../models/query-options';
import { Adapter, AdapterConstructor } from './adapter';

export class Resource extends Factory implements Adapter {


    // default variable for models
    id: number;
    libelle: string;

    /* Adapter implementation */
    readonly adaptable: Map<string, string> = new Map();
    readonly dateAdaptable: string[] = [];
    readonly hasOne: Map<string, {field: string, adapter: AdapterConstructor}> = new Map();
    readonly hasMany: Map<string, {field: string, adapter: AdapterConstructor}> = new Map();
    readonly toJsonAdditionnalFields: Map<string, string> = new Map();
    readonly toJsonAdditionnalFormDataStringify: Map<string, string> = new Map();

    private convertData(data: any): [] {
        return data.map(item => this.fromJson(item));
    }

    fromJson(json: any): Resource {
        const res = new Resource();
        this.adaptable.forEach((value, key) => {
            res[key] = json[value];
        });

        this.dateAdaptable.forEach(
            item => {
                if (this[item]) {
                    res[item] = new Date(this[item]);
                }
            }
        );

        this.hasOne.forEach((value, key) => {
            if (json[value.field]) {
            const adapter = new value.adapter();
            res[key] = adapter.fromJson(json[value.field]);
            }
        });

        this.hasMany.forEach((value, key) => {
            if (json[value.field]) {
                const adapter = new value.adapter();
                res[key] = json[value.field].map(item => adapter.fromJson(item));
            }
        });
        return res;
    }
    toJson(item: Resource): any {
        const result: {id?} = {};


        this.adaptable.forEach((value, key) => {
            if (key in item) {
                result[value] = item[key];
            }
        });

        this.toJsonAdditionnalFields.forEach((value, key) => {
            if (key in item) {
                result[value] = item[key];
            }
        });

        this.dateAdaptable.forEach(
            element => {
                const field = this.adaptable.get(element);
                if (result[field]) {
                    const date = result[field] as Date;
                    result[field] = date.toISOString().slice(0, 19).replace('T', ' ');
                }
            }
        );

        if (item.id) {
            result.id = item.id;
        }
        const formData = new FormData();
        Object.keys(result).forEach(key => formData.append(key, result[key]));

        this.toJsonAdditionnalFormDataStringify.forEach((value, key) => {
            if (key in item) {
                formData.append(key, JSON.stringify(item[key]));
            }
        })
        return formData;
    }
    /* Adapter implementation end */

    // Convert api data to resource using Adapter implementations
    create(item: any = this): Observable<Resource> {
        item = this.toJson(item);
        return super.create(item).pipe(map(data => this.fromJson(data) as Resource));
    }

    update(item: any = this, id: number = item.id): Observable<Resource> {
        item = this.toJson(item);
        return super.update(item, id).pipe(map(data => this.fromJson(data) as Resource));
    }

    delete(id: number = this.id) {
        return super.delete(id);
    }

    read(id: number = this.id): Observable<any> {
        return super.read(id).pipe(map((data: any) => this.fromJson(data) as any));
    }

    list(queryOptions?: QueryOptions): Observable<ListResult> {
        return  super.list(queryOptions).pipe(
                map((data: ListResult) => {
                        data.data = this.convertData(data.data);
                        return data;
                    }
                )
        );
    }

}
