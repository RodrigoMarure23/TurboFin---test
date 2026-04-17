export class User {
    constructor(props) {
        this.props = props;
    }
    // Getters para acceder a las propiedades de forma limpia
    get id() {
        return this.props.id;
    }
    get username() {
        return this.props.username;
    }
    get email() {
        return this.props.email;
    }
    get passwordHash() {
        return this.props.passwordHash;
    }
    get created_at() {
        return this.props.created_at;
    }
    get role() {
        return this.props.role;
    }
    get status() {
        return this.props.status;
    }
    get avatar_url() {
        return this.props.avatar_url;
    }
}
