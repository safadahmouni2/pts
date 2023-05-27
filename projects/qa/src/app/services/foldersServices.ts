import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Folder } from '../models/Folder';

@Injectable({
  providedIn: 'root'
})

export class FoldersService {

  private baseURL = `${environment.gatewayUrl}/qa-service`;
  
  public constructor(private httpClient: HttpClient) {
  }

  getFoldersByParentId(parentId): Observable<Folder[]> {
    return this.httpClient.get<Folder[]>(this.baseURL + '/folders/parent/' + parentId);
  }
  getSubFoldersByFolderRefId(parentFolderRefId): Observable<Folder[]> {
    return this.httpClient.get<Folder[]>(this.baseURL + '/folders/subFolder/' + parentFolderRefId);
  }

  addFolder(folder: Folder): Observable<any> {
    return this.httpClient.post(this.baseURL + '/folders', folder);
  }
  
  dragAndDropFolder(folder: any, folderId): Observable<any> {
    return this.httpClient.put(this.baseURL + '/folders' + '/dragAndDropFolder/' + folderId, folder);
  }
  renameFolder( folderId,folderName): Observable<any> {
    return this.httpClient.put(this.baseURL + '/folders' + '/' + folderId + '/rename',folderName);
  }
}
