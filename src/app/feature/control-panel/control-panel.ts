import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface PanelLink {
  route: string;
  title: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-control-panel',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './control-panel.html',
  styleUrl: './control-panel.css'
})
export class ControlPanel {
  protected readonly panelLinks: PanelLink[] = [
    {
      route: '/accounts',
      title: 'Contas',
      description: 'Cadastre, edite e monitore contas com saldos e tipos definidos.',
      icon: 'CO'
    },
    {
      route: '/account-type',
      title: 'Tipos de Conta',
      description: 'Defina e mantenha as categorias que organizam suas contas.',
      icon: 'TC'
    }
  ];
}
