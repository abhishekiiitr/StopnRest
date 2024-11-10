export class User {
    constructor(
      public fullName: string = '',
      public email: string = '',
      public phoneNumber: number = 0,
      public password: string = '',
      // public confirmPassword: string = '',
      public role: string = '' 
    ) {}
  }
  