import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GenerateNewModuleRequest } from 'src/app/models/GenerateNewModuleRequest/generate-new-module-request';
import { GenerateTopicContent } from 'src/app/models/GenerateTopicContent/generate-topic-content';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {

  constructor(private http: HttpClient) { }

  getAllGeneratedModules(studentId: any) {
    const path = environment.apiUrl + "generate/get-modules?" + "studentId=" + studentId;
    return this.http.get(path);
  }

  getTopicList(moduleId: any) {
    const path = environment.apiUrl + "generate/get-topics?" + "moduleId=" + moduleId;
    return this.http.get(path);
  }

  getTopicContent(topicContentRequest: GenerateTopicContent) {
    const path = environment.apiUrl + "generate/get-module-content";
    return this.http.post(path, topicContentRequest);
  }

  generateNewModule(generateModuleRequest: GenerateNewModuleRequest) {
    const path = environment.apiUrl + "generate/new-module";
    return this.http.post(path, generateModuleRequest);
  }

  levelUpModule(generateModuleRequest: GenerateNewModuleRequest) {
    const path = environment.apiUrl + "generate/level-up-module";
    return this.http.post(path, generateModuleRequest);
  }
}
