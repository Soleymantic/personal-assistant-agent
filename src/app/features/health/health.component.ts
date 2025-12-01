import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { HealthService, HealthResponse } from '../../core/services/health.service';

@Component({
  selector: 'app-health',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './health.component.html',
  styleUrls: ['./health.component.css']
})
export class HealthComponent implements OnInit {
  private readonly healthService = inject(HealthService);

  health?: HealthResponse;
  loading = true;

  ngOnInit(): void {
    this.healthService.checkHealth().subscribe((health) => {
      this.health = health;
      this.loading = false;
    });
  }
}
