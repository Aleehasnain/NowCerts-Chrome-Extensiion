import { Injectable } from '@angular/core';
import * as jwt_encode from 'jwt-encode';

@Injectable({
  providedIn: 'root',
})
export class JwtService {
  private userEmail: string;

  setUserEmail(email: string): void {
    this.userEmail = email;
  }

  getUserEmail(): string {
    return this.userEmail;
  }
  constructor() {}
  encodeData(): string {
    function addMinutes(date, minutes) {
      date.setMinutes(date.getMinutes() + minutes);

      return date;
    }

    const date = new Date();

    const newDate = addMinutes(date, 10);
    var ts = Math.round(newDate / 1000);
     const loggedData = localStorage.getItem('loggedData');
    const loggedObj = JSON.parse(loggedData!);
     // 2022-05-15T00:10:00.000Z
    // return jwt.sign(payload, secretKey);
    const secret = 'MFO1S3L98vc4h8Qla7dIeA9LHpxOMJLYoywWpXsKaBU';
   const data = {
      exp: ts,
      email: loggedObj?.email,
      agency_id: loggedObj?.agency_id,
      role: loggedObj?.role

    };
    const jwt = jwt_encode(data, secret);
    return jwt;
  }
}
