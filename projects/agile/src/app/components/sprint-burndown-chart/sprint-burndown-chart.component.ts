import { Component, ViewEncapsulation, OnInit, Input } from '@angular/core';

import * as d3Selection from 'd3';
import * as d3Scale from 'd3-scale';
import * as d3ScaleChromatic from 'd3-scale-chromatic';
import * as d3Shape from 'd3-shape';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';
import * as d3TimeFormat from 'd3-time-format';
import { ActivatedRoute, Router } from '@angular/router';
import { Sprint } from '../../models/sprint.model';
import { SprintService, UserStoryService, UserService, DailyScrumService } from '../../services';
import { UserStory } from '../../models/user-story.model';
import { DatePipe } from '@angular/common';
import { SprintMemberGraphQlService } from '../../services/pts-api/agile/sprint-member.service';
@Component({
    selector: 'app-sprint-burndown-chart',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './sprint-burndown-chart.component.html',
    styleUrls: ['./sprint-burndown-chart.component.css']
})
export class SprintBurndownChartComponent implements OnInit {
    sprintId: number;
    productid: any;
    serverpath: string = 'https://pts.thinktank.de';
    currentUserPict: string;
    datas2 = [
        {
            'id': 'estmation',
            'values': [

            ]
        },
        {
            'id': 'real',
            'values': [
            ]
        },
    ];
    userStory: UserStory = new UserStory();
    userStories: UserStory[];
    sprint: Sprint = new Sprint();
    data: any;
    daysOfSprint: number;
    daysofwork: number = 0;
    svg: any;
    margin = { top: 20, right: 80, bottom: 30, left: 50 };
    g: any;
    width: number;
    height: number;
    x;
    y;
    z;
    line;
    totalPoints;
    nbreOfParticipentsdays = 0;
    focusFactor = 0;
    estimatedDaysnextSprint = 0;
    numberofTeam: number;
    storyPointsNextSprint: number = 0;
    storyPointsDone: number = 0;
    constructor(private route: ActivatedRoute,
        private sprintService: SprintService,
        private userService: UserService,
        private dailyScrumService: DailyScrumService,
        private router: Router,
        private userStoryService: UserStoryService,
        private sprintMemberGrapgQlService:SprintMemberGraphQlService,
        private datePipe: DatePipe) {

    }
    ngOnInit() {
        this.route.paramMap.subscribe(param => {

            this.productid = param.get('dproductid');
            this.sprintId = +param.get('sprintId');
        });
        this.userService.getCurrentUser().subscribe(dataSource => {
            for (const data of dataSource) {
                this.currentUserPict = data.photo;
            }
        });
        this.data = this.datas2.map((v) => v.values.map((val) => val.date))[0];
        this.sprintService.getProductBySprintsId(this.sprintId).subscribe(res => {
            this.sprint.product = res[0].name;
            this.productid = res[0].id;
            this.chartData(this.sprintId, this.productid);
        });
    }

    chartData(idsprint: any, productId: any): void {
        let stateId
        const SearchSprintMemberInput = {
          sprintId: idsprint,
          //stateId:1030058 : sprintMmeber status ON
          stateId
        };   
        this.sprintMemberGrapgQlService.filterSprintMembers(SearchSprintMemberInput).subscribe(users => {
  
            this.numberofTeam = users.filterSprintMembers.items.length;

            this.sprintService.getMySprintsByProduct(productId).subscribe(datasource => {

                for (const response1 of datasource) {
                    if (response1.Sprint_ID === this.sprintId) {
                        this.sprint.endDate = new Date(this.datePipe.transform(response1.endDate, 'yyyy-MM-ddTHH:mm'));
                        this.sprint.startDate = new Date(this.datePipe.transform(response1.startDate, 'yyyy-MM-ddTHH:mm'));
                        this.sprint.name = response1.Name;
                        const diffc = this.sprint.endDate.getTime() - this.sprint.startDate.getTime();
                        this.daysOfSprint = Math.round(Math.abs(diffc / (1000 * 60 * 60 * 24)));
                    }

                }

                this.userStoryService.getUserstoryPointsDsbySprint(idsprint).subscribe(res => {
                    this.totalPoints = res[0].totalStoryPoints;
                    const valueOfData = { 'date': new Date(''), 'Points': 0 };
                    valueOfData.Points = +(res[0].totalStoryPoints);
                    valueOfData.date = new Date(this.sprint.startDate);
                    this.datas2[1].values.push(valueOfData);
                    for (let index = 0; index < res.length; index++) {
                        const dateDs = new Date(res[index].meetingDay);
                        const dateStartSprint = new Date(this.sprint.startDate);
                        if (dateDs.getTime() !== dateStartSprint.getTime()) {
                            const valueOfData1 = { 'date': new Date(), 'Points': 0 };
                            valueOfData1.Points = +(res[index].totalStoryPoints - res[index].closedStoryPoints);
                            valueOfData1.date = new Date(res[index].meetingDay);
                            this.datas2[1].values.push(valueOfData1);
                        }
                    }

                    let TodayDay = 0;
                    for (let index = 0; index <= this.daysOfSprint; index++) {
                        let x = this.totalPoints;
                        const valueOfData2 = { 'date': new Date('2011-10-01'), 'Points': 80 };
                        x = x - ((index * (this.totalPoints / this.daysOfSprint)));
                        valueOfData2.Points = +x.toFixed(2);
                        valueOfData2.date = new Date((this.sprint.startDate.getTime() + (index * (1000 * 60 * 60 * 24))));
                        TodayDay = valueOfData2.date.getDay();
                        if (TodayDay !== 0) {
                            if (TodayDay !== 6) {
                                this.data.push(valueOfData.date);
                                this.datas2[0].values.push(valueOfData);
                                this.daysofwork = this.daysofwork + 1;
                            }
                        }
                    }
                    this.userStoryService.getUserStoriesBySprint(idsprint).subscribe(userStories => {

                        this.userStories = userStories;
                        for (const userStory of this.userStories) {
                            if (userStory.state === 'Done') {
                                this.storyPointsDone += (+userStory.storyPoints);
                            }
                        }
                        this.nbreOfParticipentsdays = Math.round(this.numberofTeam * this.daysofwork);
                        this.focusFactor = Math.round((this.storyPointsDone / this.nbreOfParticipentsdays) * 100);

                        this.svg = d3Selection.select('svg');
                        this.width = this.svg.attr('width') - this.margin.left - this.margin.right - 30;
                        this.height = this.svg.attr('height') - this.margin.top - this.margin.bottom - 40;
                        this.g = this.svg.append('g').attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
                        this.x = d3Scale.scaleTime().range([0, this.width]);
                        this.y = d3Scale.scaleLinear().range([this.height, 0]);
                        this.z = d3Scale.scaleOrdinal(d3ScaleChromatic.schemeSet1);
                        this.line = d3Shape.line().curve(d3Shape.curveLinear)
                            .x((d: any) => this.x(d.date))
                            .y((d: any) => this.y(d.Points));

                        const div = d3Selection.select('body').append('div')
                            .attr('class', 'tooltip')
                            .style('opacity', 0);

                        this.x.domain(d3Array.extent(this.data, (d: Date) => d));
                        this.y.domain([
                            d3Array.min(this.datas2, function (c) { return d3Array.min(c.values, function (d) { return d.Points; }); }),
                            d3Array.max(this.datas2, function (c) { return d3Array.max(c.values, function (d) { return d.Points; }); })
                        ]);

                        this.z.domain(this.datas2.map(function (c) { return c.id; }));

                        // gridlines in x axis function
                        const make_x_gridlines = d3Axis.axisBottom(this.x);
                        // gridlines in y axis function
                        const make_y_gridlines = d3Axis.axisLeft(this.y);

                        // add the X gridlines
                        this.g.append('g')
                            .attr('class', 'grid')
                            .attr('transform', 'translate(0,' + this.height + ')')
                            .call(make_x_gridlines.tickSize(-this.height).ticks(this.daysOfSprint)
                                .tickFormat(d3TimeFormat.timeFormat(''))
                            );

                        // add the Y gridlines
                        this.g.append('g')
                            .attr('class', 'grid')
                            .call(make_y_gridlines.tickSize(-this.width).ticks(10)
                                .tickFormat(d3TimeFormat.timeFormat(''))
                            );

                        this.g.append('g')
                            .attr('class', 'axis axis--x')
                            .attr('transform', 'translate(0,' + this.height + ')')
                            .call(d3Axis.axisBottom(this.x)
                                .tickFormat(d3TimeFormat.timeFormat('%d-%b'))
                                .ticks(this.daysOfSprint).tickPadding(8))
                            .style('font', '15px sans-serif')
                            .selectAll('text')
                            .style('text-anchor', 'end')
                            .attr('dx', '-.8em')
                            .attr('dy', '.15em')
                            .attr('transform', 'rotate(-65)');
                        this.g.append('g')
                            .append('text')
                            .attr('transform', 'rotate(0)')
                            .attr('y', 675)
                            .attr('x', 480)
                            .attr('dy', '0.71em')
                            .attr('fill', '#000')
                            .text('Sprint')
                            .style('font', '25px sans-serif');
                        this.g.append('g')
                            .attr('class', 'axis axis--y')
                            .call(d3Axis.axisLeft(this.y).ticks(10).tickPadding(4))
                            .style('font', '15px sans-serif')
                            .append('text')
                            .attr('transform', 'rotate(-90)')
                            .attr('y', -50)
                            .attr('x', -250)
                            .attr('dy', '0.71em')
                            .attr('fill', '#000')
                            .text('Story Points')
                            .style('font', '25px sans-serif');

                        const city = this.g.selectAll('.city')
                            .data(this.datas2)
                            .enter()
                            .append('g')
                            .attr('class', 'city');

                        city.append('path')
                            .attr('class', 'line')
                            .attr('d', (d) => this.line(d.values))
                            .style('stroke', (d) => (this.z(d.id)));
                        const format = d3TimeFormat.timeFormat('%d -%b');
                        for (let i = 0; i < this.datas2[1].values.length; i++) {
                            city.append('circle')
                                .datum(function (d) { return { value: d.values[i] }; })
                                .attr('transform', (d) => 'translate(' + this.x(d.value.date) + ',' + this.y(d.value.Points) + ')')
                                .attr('fill', '#3c3c3e')
                                .attr('r', 3)
                                .on('mouseover', function (d) {
                                    div.style('transition-duration', '.2s')
                                        .style('opacity', .9);

                                    const event = d3Selection.event as MouseEvent;
                                    div.html(Math.round(d.value.Points) + '<br/>' + format(d.value.date))
                                        .style('left', (event.pageX) + 'px')
                                        .style('top', (event.pageY - 28) + 'px')
                                        .style('font', '13px sans-serif');
                                })
                                .on('mouseout', function (d) {
                                    div.style('transition-duration', '.5s')
                                        .style('opacity', 0);
                                });
                        }

                        city.append('line')
                            .attr('x1', 850)
                            .attr('y1', 20)
                            .attr('x2', 900)
                            .attr('y2', 20)
                            .attr('stroke', '#3484bb');

                        city.append('text')
                            .attr('y', 20)
                            .attr('x', 955)
                            .attr('text-anchor', 'middle')
                            .attr('class', 'myLabel')
                            .text(' Real Burndown');

                        city.append('line')
                            .attr('x1', 850)
                            .attr('y1', 40)
                            .attr('x2', 900)
                            .attr('y2', 40)
                            .attr('stroke', '#e52224');

                        city.append('text')
                            .attr('y', 40)
                            .attr('x', 970)
                            .attr('text-anchor', 'middle')
                            .attr('class', 'myLabel')
                            .text('Estimated Burndown');
                    });
                });
            });
        });

    }
    estimated() {

        if ((this.focusFactor > 0)) {
            this.estimatedDaysnextSprint = Math.round((this.storyPointsNextSprint * 100) / (this.focusFactor * this.numberofTeam));

        }
    }
}



