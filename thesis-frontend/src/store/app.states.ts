import { Ticket } from "src/models/ticket";
import { Comment } from "src/models/comment";
import { State } from "./models";
import { Documentation } from "src/models/documentation";
import { Discussion } from "src/models/discussion";
import { User } from "src/models/user";
import { Project } from "src/models/project";
import { ProgrammerStatisticsResponse } from "src/models/programmer-statistics";
import { Status } from "src/models/status";
import { Invite } from "src/models/invite";
import { Notification } from 'src/models/notification';

export interface AppState {
    ticketState: TicketState;
    commentState: CommentState;
    discussionState: DiscussionState;
    documentationState: DocumentationState;
    userState: UserState;
    projectState: ProjectState;
    statisticsState: StatisticsState;
    statusState: StatusState;
    inviteState: InviteState;
    notificationState: NotificationState;
}

export interface TicketState extends State {
    tickets: Ticket[];
    ticket: Ticket;
    total: number;
}

export interface CommentState extends State {
    comments: Comment[];
    comment: Comment;
    total: number;
}

export interface DocumentationState extends State {
    documentations: Documentation[];
    documentation: Documentation;
    total: number;
}

export interface DiscussionState extends State {
    discussions: Discussion[];
    discussion: Discussion;
    total: number;
}

export interface UserState extends State {
    users: User[];
    user: User;
    loggedInUser: User | undefined;
    total: number;
}

export interface ProjectState extends State {
    projects: Project[];
    project: Project;
    total: number;
}

export interface StatisticsState extends State {
    programmerStatistics: ProgrammerStatisticsResponse[];
    total: number;
}

export interface StatusState extends State {
    statuses: Status[];
    status: Status;
    total: number;
}

export interface InviteState extends State {
    invites: Invite[];
    invite: Invite;
    total: number;
}
export interface NotificationState extends State {
    notifications: Notification[];
    notification: Notification;
    total: number;
}
