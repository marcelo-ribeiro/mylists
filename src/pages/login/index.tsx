import { googleLogin } from "core/auth";
import { useRouter } from "next/router";

export default function Login() {
  const router = useRouter();

  const login = async () => {
    const response = await googleLogin();
    if (response.user) {
      router.push("/");
    }
  };

  return (
    <ion-content>
      <section className="ion-page">
        <div className="logo">
          <div className="logo__icon">
            <ion-icon color="primary" name="list-circle" />
          </div>
          <h1 className="logo__title">mylists</h1>
        </div>

        <div className="actions">
          <h5>
            <ion-text color="medium">Entrar com:</ion-text>
          </h5>

          <ion-button
            id="signup-button"
            color="primary"
            onClick={() => login()}
            expand="block"
          >
            <ion-icon name="logo-google" slot="start" />
            Google
          </ion-button>
        </div>
      </section>
    </ion-content>
  );
}
