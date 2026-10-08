import ClientAuth, { TAB_LOGIN } from "../components/auth/ClientAuth";

function ClientLogin() {
    return <ClientAuth initialTab={TAB_LOGIN} />;
}

export default ClientLogin;
