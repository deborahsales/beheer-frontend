import { bootstrapApplication } from '@angular/platform-browser';
import { registerLicense } from '@syncfusion/ej2-base';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

registerLicense(
  'ORg4AjUWIQA/Gnt3VVhhQlJDfV5AQmBIYVp/TGpJfl96cVxMZVVBJAtUQF1hTH5UdEJiXX1bdHJcQ2hVWkd2'
);

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
