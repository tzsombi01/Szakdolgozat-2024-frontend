import { Ticket } from "src/models/ticket";
import { Comment } from "src/models/comment";
import { State } from "./models";
import { Documentation } from "src/models/documentation";
import { Discussion } from "src/models/discussion";
import { User } from "src/models/user";
import { Project } from "src/models/project";

export interface AppState {
    ticketState: TicketState;
    commentState: CommentState;
    discussionState: DiscussionState;
    documentationState: DocumentationState;
    userState: UserState;
    projectState: ProjectState;
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
