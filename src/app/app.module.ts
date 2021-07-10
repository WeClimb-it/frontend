import { LOCATION_INITIALIZED } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, Injector, NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { FacebookLoginProvider, SocialAuthServiceConfig, SocialLoginModule } from 'angularx-social-login';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
import {
  PerfectScrollbarConfigInterface,
  PerfectScrollbarModule,
  PERFECT_SCROLLBAR_CONFIG,
} from 'ngx-perfect-scrollbar';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BottomSheetComponent } from './components/bottom-sheet/bottom-sheet.component';
import { HeaderComponent } from './components/header/header.component';
import { MapComponent } from './components/map/map.component';
import { MediaPlayerComponent } from './components/media-player/media-player.component';
import { SharedModule } from './components/shared.module';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { UserLoginComponent } from './components/userAuth/login/login.component';
import { MaterialModule } from './material.module';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { PipesModule } from './pipes/pipes.module';
import { I18nService } from './services/i18n.service';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
};

const appComponents = [
  AppComponent,
  MapComponent,
  HeaderComponent,
  SidebarComponent,
  NotFoundComponent,
  MediaPlayerComponent,
  UserLoginComponent,
  BottomSheetComponent,
];

const MaterialModules = [MatBottomSheetModule, MaterialModule];

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/lang/', '.json');
}

export function appInitializerFactory(translateService: TranslateService, injector: Injector): () => Promise<any> {
  return () =>
    new Promise<any>((resolve: any) => {
      const locationInitialized = injector.get(LOCATION_INITIALIZED, Promise.resolve(null));
      locationInitialized.then(() => {
        translateService.addLangs(environment.i18n.availableLangs);
        translateService.setDefaultLang(I18nService.userLang);
        translateService.use(I18nService.userLang);

        resolve(null);
      });
    });
}

@NgModule({
  declarations: [...appComponents],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    NgxMapboxGLModule.withConfig({
      accessToken: environment.mapbox.token,
    }),
    HttpClientModule,
    FlexLayoutModule,
    ...MaterialModules,
    FormsModule,
    PerfectScrollbarModule,
    PipesModule,
    SharedModule,
    SocialLoginModule,
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFactory,
      deps: [TranslateService, Injector],
      multi: true,
    },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: true,
        providers: [
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider(environment.facebookAppId, {
              scope: environment.facebookScopes,
              return_scopes: false,
              enable_profile_selector: false,
              version: 'v4.0',
              locale: 'en_US',
              fields: 'name,email,picture,first_name,last_name',
              cookie: true,
              status: true,
            }),
          },
        ],
      } as SocialAuthServiceConfig,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
