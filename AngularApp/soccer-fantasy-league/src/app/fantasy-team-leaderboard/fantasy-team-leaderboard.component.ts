import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-fantasy-team-leaderboard',
  templateUrl: './fantasy-team-leaderboard.component.html',
  styleUrls: ['./fantasy-team-leaderboard.component.scss']
})
export class FantasyTeamLeaderboardComponent implements OnInit {

  displayedColumns = ['teamName', 'username', 'totalPoints'];

  dataSource = new MatTableDataSource();

  ngOnInit(): void {
    
  }
}
