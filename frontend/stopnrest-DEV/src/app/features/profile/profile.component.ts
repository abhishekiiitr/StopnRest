import { Component, OnInit } from '@angular/core';
import { UserServiceService } from 'src/app/core/service/user-service.service';
import { AuthService } from 'src/app/core/service/auth.service';
import { UpdateProfile } from 'src/app/auth/model/updateProfile';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userInfo: any = {}; // Initialize as an empty object to avoid undefined issues
  editMode = false;
  changePasswordMode = false;
  userId = localStorage.getItem('userId'); // Get the logged-in user's ID from localStorage
  token = localStorage.getItem('authToken'); // Get the auth token from localStorage
  profileInfo: UpdateProfile = { userName: '', email: '', profilePic: '', contact: 0 };
  passwordInfo: { newPassword: string; confirmPassword: string } = { newPassword: '', confirmPassword: '' };

  constructor(
    private userService: UserServiceService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadUserInfo(); // Load user info on component initialization
  }

  loadUserInfo() {
    this.userService.getUserById(this.userId, this.token).subscribe({
      next: (data) => {
        this.userInfo = data;
        this.profileInfo.userName = this.userInfo.userName;
        this.profileInfo.email = this.userInfo.email;
        this.profileInfo.contact = this.userInfo.contact;
        this.profileInfo.profilePic = this.userInfo.profilePic;
      },
      error: (err) => {
        console.error('Error fetching user info:', err);
      }
    });
  }

  uploadImg(fileInput: any) {
    if (fileInput.target.files && fileInput.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (e: any) => {
        let img = new Image();
        img.src = e.target.result;
        img.onload = () => {
          this.profileInfo.profilePic = e.target.result;

        };
      };
      reader.readAsDataURL(fileInput.target.files[0]);
    }
  }

  toggleEdit() {
    this.editMode = !this.editMode;
    this.changePasswordMode = false;
  }

  toggleChangePassword() {
    this.changePasswordMode = !this.changePasswordMode;
    this.editMode = false; // Ensure edit mode is off
  }

  saveChanges() {
    this.userService.editProfile(this.userId, this.profileInfo, this.token).subscribe({
      next: () => {
        this.editMode = false;
        alert('Profile updated successfully!');
        this.loadUserInfo(); // Reload the updated user info
      },
      error: (err) => {
        alert('Error updating profile: ' + err.message);
        console.log(this.profileInfo)
      }
    });
  }

  changePassword() {
    if (this.passwordInfo.newPassword === this.passwordInfo.confirmPassword) {
      this.userService.editPassword(this.userId, this.passwordInfo.newPassword, this.token).subscribe({
        next: () => {
          alert('Password changed successfully!');
          this.changePasswordMode = false; // Close change password mode
        },
        error: (err) => {
          alert('Error changing password: ' + err.message);
        }
      });
    } else {
      alert('Passwords do not match!');
    }
  }

  logout() {
    this.authService.logout();
  }
}
