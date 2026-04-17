export class Message {
    constructor(props) {
        this.props = props;
    }
    get id() {
        return this.props.id;
    }
    get userId() {
        return this.props.userId;
    }
    get content() {
        return this.props.content;
    }
    get likesCount() {
        return this.props.likesCount;
    }
    get created_at() {
        return this.props.created_at;
    }
    get parent_id() {
        return this.props.parent_id;
    }
    get username() {
        return this.props.username;
    }
    // Lógica de dominio: un mensaje no puede tener likes negativos
    canBeLiked() {
        return this.props.likesCount >= 0;
    }
}
export class GetRecentActivity {
    constructor(repository) {
        this.repository = repository;
    }
    async execute(userId) {
        return await this.repository.getRecentActivity(userId);
    }
}
