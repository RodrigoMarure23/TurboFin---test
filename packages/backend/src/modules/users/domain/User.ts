export interface UserProps {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  created_at?: Date;
  role?: "user" | "admin";
  status?: "active" | "inactive";
  avatar_url?: string | null;
}

export class User {
  constructor(public readonly props: UserProps) {}

  // Getters para acceder a las propiedades de forma limpia
  get id(): string {
    return this.props.id;
  }
  get username(): string {
    return this.props.username;
  }
  get email(): string {
    return this.props.email;
  }
  get passwordHash(): string {
    return this.props.passwordHash;
  }
  get created_at(): Date | undefined {
    return this.props.created_at;
  }
  get role(): "user" | "admin" | undefined {
    return this.props.role;
  }
  get status(): "active" | "inactive" | undefined {
    return this.props.status;
  }
  get avatar_url(): string | null | undefined {
    return this.props.avatar_url;
  }
  

  // Aquí podrías añadir métodos de dominio como user.validatePassword()
}
