import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
@Injectable()
export class AuthService {

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  login(loginForm: any) {
    console.log('Tentative de connexion');


    // On récupère l'url de redirection
    const redirectUrl = this.route.snapshot.queryParams['redirectUrl'] || '/app-home';

    // On accède à la page souhaitée
    this.router.navigate([redirectUrl]);
    // Ajout des roles au modèle utilisateur
    let rolesUser = [];
    if (loginForm.username === 'HJR') {
      rolesUser = ['HR-manager'];
    } else  {
      rolesUser = ['EMP'];
    }

    this.setUser({ login: loginForm.username, roles: rolesUser });
  }

  logout() {
    console.log('Tentative de déconnexion');

    this.clearUser();
    this.router.navigate(['/login']);
  }

  getUser() {
    return JSON.parse(localStorage.getItem('user'));
  }

  setUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  clearUser() {
    localStorage.removeItem('user');
  }
  hasAnyRole(roles: string[]) {
  //   const user = this.getUser();

  //   for (const role of user.roles) {
  //     if (roles.includes(role)) {
  //       return true;
  //     }
  //   }
  //   return false;
 }
}
