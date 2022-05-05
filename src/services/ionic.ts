export const presentAlertPrompt = async (
  list?: any,
  handleSubmit?: (data: any) => void,
  handleCancel?: () => void
) => {
  const alert = document.createElement("ion-alert");
  alert.cssClass = "my-custom-class";
  alert.header = !!list ? "Editar lista" : "Criar lista";
  alert.translucent = true;
  alert.backdropDismiss = false;
  alert.inputs = [
    {
      name: "name",
      type: "text",
      placeholder: "Nome da lista",
      value: list?.name ?? "",
    },
  ];
  alert.buttons = [
    {
      text: "Fechar",
      role: "cancel",
      handler: () => handleCancel?.(),
    },
    {
      text: "Salvar",
      handler: (data) => handleSubmit?.(data),
    },
  ];

  document.body.appendChild(alert);
  return alert.present();
};
