export default function Modal() {
  const headerTitle = "Title";

  const dismiss = () => {
    this.modalController.dismiss({
      name: this.name,
      price: this.price,
      quantity: this.quantity,
      date: this.date,
    });
  };

  return (
    <>
      <ion-header class="ion-no-border" translucent>
        <ion-toolbar>
          <ion-buttons slot="end">
            <ion-button onClick={() => dismiss()}>
              <ion-icon color="medium" name="close-outline" slot="icon-only" />
            </ion-button>
          </ion-buttons>

          <ion-title>{headerTitle}</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-content fullscreen>
        <ion-list class="ion-no-padding">
          <ion-item>
            <ion-label position="fixed">Nome</ion-label>
            <ion-input name="name" />
          </ion-item>

          <ion-item>
            <ion-label position="fixed">Preço</ion-label>
            <ion-input type="tel" name="price" />
          </ion-item>

          <ion-item>
            <ion-label position="fixed">Quantidade</ion-label>
            <ion-input type="number" min="1" name="quantity" />
          </ion-item>

          <ion-item>
            <ion-label position="fixed">Data</ion-label>
            <ion-datetime
              name="date"
              cancelText="Fechar"
              doneText="Ok"
              min="1990-02"
              display-format="DD/MM/YYYY"
              month-short-names="jan, fev, mar, abr, mai, jun, jul, ago, set, out, nov, dez"
            />
          </ion-item>
        </ion-list>

        <div className="ion-padding-vertical">
          <ion-button expand="full" onClick={() => dismiss()}>
            Salvar
          </ion-button>
        </div>
      </ion-content>
    </>
  );
}
