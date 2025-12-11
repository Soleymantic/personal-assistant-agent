import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-session',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-session.component.html',
  styleUrls: ['./user-session.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserSessionComponent {
  @Input({ required: true }) user!: User;
  @Output() logout = new EventEmitter<void>();

  onLogout(): void {
    this.logout.emit();
  }
}
