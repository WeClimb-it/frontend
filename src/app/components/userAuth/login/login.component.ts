import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FacebookLoginProvider, SocialAuthService, SocialUser } from 'angularx-social-login';
import { AppStoreService } from 'src/app/services/appState.service';

@Component({
  selector: 'wci-user-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserLoginComponent implements OnInit {
  @Output() userLoggedIn: EventEmitter<SocialUser> = new EventEmitter<SocialUser>();
  @Output() userLoggedOut: EventEmitter<void> = new EventEmitter<void>();

  loggedIn: boolean;

  constructor(private authService: SocialAuthService, private appStore: AppStoreService) {}

  ngOnInit() {
    this.authService.authState.subscribe((user) => {
      this.loggedIn = user != null;

      if (user != null && user.authToken.length > 0) {
        this.userLoggedIn.emit(user);
      }
    });
  }

  /**
   *
   */
  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  /**
   *
   */
  signOut(): void {
    this.authService.signOut();
    this.userLoggedOut.emit();
  }
}
