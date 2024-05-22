import { auth } from "core/firebase";
import { IItem, IList } from "core/list.model";
import { User } from "core/user.model";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  addListItem,
  deleteList,
  deleteListItem,
  getList,
  getListsItemsRealtime,
  updateList,
  updateListItem,
} from "services/lists";
import {
  formatCurrency,
  formatCurrencyToNumber,
  formatNumber,
} from "utils/formatNumber";

export const useItems = (listId: string) => {
  const [items, setItems] = useState<IItem[]>(null);

  useEffect(() => {
    if (!listId) return;
    const unsubscribe = getListsItemsRealtime(listId, setItems);
    return () => unsubscribe();
  }, [listId]);

  return {
    items,
  };
};

export default function List() {
  const router = useRouter();
  const listId = router.query.id as string;
  const [user, setUser] = useState<User>(null);
  const { items } = useItems(!!user ? listId : null);
  const [list, setList] = useState<IList>(null);
  const [isReady, setIsReady] = useState(false);
  const [modal, setModal] = useState<any>({});
  const modalRef = document.querySelector("#modal") as HTMLIonModalElement;

  const sum = useMemo(() => {
    if (!items || !items.length) return 0;
    return items
      .filter((item: any) => !item.isChecked)
      .reduce(
        (amount: number, current: any) =>
          amount +
          (parseFloat(current.price) || 0) * (parseInt(current.quantity) || 1),
        0
      );
  }, [items]);

  const itemsCount = useMemo(() => {
    if (!items) return 0;
    return items.filter((i: IItem) => !i.isChecked).length;
  }, [items]);

  const add = async (item: IItem) => {
    item = {
      ...item,
      price: item.price || 0,
      quantity: item.quantity || 1,
    };
    await addListItem(list.id, item);
  };

  const update = async (item: IItem) => {
    await updateListItem(list.id, item);
  };

  const handleUpdateList = useCallback(async () => {
    console.log("handleUpdateList", {
      ...list,
      total: sum,
      itemsLength: itemsCount,
    });

    await updateList({
      ...list,
      total: sum,
      itemsLength: itemsCount,
    });
  }, [itemsCount, sum]);

  const handleDeleteItem = async (itemId: string) => {
    await deleteListItem(list.id, itemId);
  };

  const handleDeleteList = async () => {
    router.back();
    await deleteList(list.id);
  };

  const presentModal = async (event: any, item?: IItem) => {
    event.stopPropagation();

    setModal((modal: any) => ({
      ...modal,
      isOpen: true,
      backdropDismiss: false,
      swipeToClose: true,
      componentProps: {
        id: item?.id,
        headerTitle: item ? "Editar item" : "Adicionar item",
        isEdit: !!item,
        name: item?.name ?? "",
        price: formatNumber(item?.price) ?? 0,
        quantity: item?.quantity ?? 1,
        date: item?.date ?? "",
      },
    }));
  };

  const dismiss = () => {
    modalRef?.dismiss();
    setModal((modal: any) => ({ ...modal, isOpen: false }));
  };

  const submit = async () => {
    const { id, name, price, quantity, date, isEdit } = modal.componentProps;
    const item: IItem = {
      id,
      name,
      price: formatCurrencyToNumber(price),
      quantity: Number(quantity),
      date,
      isChecked: false,
    };
    if (isEdit) {
      await update(item);
    } else {
      await add(item);
    }
    dismiss();
  };

  const changeFormItem = (event: any) => {
    const { componentProps } = modal;
    const { name, value } = event.target;
    let formattedValue = value;

    if (name === "price") {
      formattedValue = value;
    }

    setModal((modal: any) => ({
      ...modal,
      componentProps: {
        ...componentProps,
        [name]: formattedValue,
      },
    }));
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        router.replace("/login");
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    console.log("useEffect getList");

    if (!user) return;
    getList(listId).then(async (list: IList) => {
      setIsReady(true);
      setList(list);
    });
  }, [user]);

  useEffect(() => {
    if (!isReady) return;
    handleUpdateList();
  }, [items]);

  return (
    <>
      <ion-header translucent>
        <ion-toolbar>
          <ion-buttons slot="start">
            {/* <ion-back-button
              color="medium"
              text=""
              icon="close-outline"
              onClick={() => router.back()}
            /> */}
            <ion-button onClick={() => router.back()}>
              <ion-icon name="chevron-back-outline" slot="icon-only" />
            </ion-button>
          </ion-buttons>

          <ion-title>{list?.name}</ion-title>
        </ion-toolbar>

        <ion-toolbar class="subheader">
          <ion-title hidden={isReady}>
            <ion-skeleton-text
              class="ion-margin-end"
              animated
              style={{ width: "90px" }}
            />
            <ion-skeleton-text animated style={{ width: "80px" }} />
          </ion-title>

          {!!items?.length && (
            <ion-title>
              {sum !== 0 && (
                <strong>
                  <ion-text class="list__sum" color="primary">
                    {formatCurrency(sum)}
                  </ion-text>
                  <ion-text color="medium">&nbsp;&nbsp;</ion-text>
                </strong>
              )}
              <ion-text color="medium">
                {itemsCount === 0
                  ? "Nenhum item"
                  : itemsCount === 1
                  ? `(${itemsCount} item)`
                  : `(${itemsCount} itens)`}
              </ion-text>
            </ion-title>
          )}
        </ion-toolbar>
      </ion-header>

      <ion-content fullscreen>
        <ion-fab vertical="bottom" horizontal="end" slot="fixed">
          {isReady && !items.length && (
            <ion-fab-button
              class="ion-margin-bottom"
              color="danger"
              onClick={() => handleDeleteList()}
            >
              <ion-icon name="trash" />
            </ion-fab-button>
          )}

          <ion-fab-button
            color="primary"
            onClick={(event) => presentModal(event)}
          >
            <ion-icon name="add" />
          </ion-fab-button>
        </ion-fab>

        <section className="my-wrapper-list">
          {!!items?.length && (
            <ion-list>
              {items.map((item: IItem) => (
                <ion-item-sliding key={item.id}>
                  <ion-item
                    button
                    onClick={(event) => presentModal(event, item)}
                  >
                    <ion-checkbox
                      slot="start"
                      name={item.id}
                      checked={item.isChecked}
                      onClick={(event) => {
                        event.stopPropagation();
                        item.isChecked = !item.isChecked;
                        update(item);
                      }}
                    />

                    <ion-label class="ion-text-wrap">
                      <ion-text>{item.name}</ion-text>

                      <p>
                        {item.quantity >= 2 && (
                          <ion-text style={{ display: "flex", gap: 24 }}>
                            <span>
                              {formatCurrency(item.price * item.quantity)}
                            </span>
                            <span>Itens: {item.quantity}</span>
                            <span>Preço: {formatCurrency(item.price)}</span>
                          </ion-text>
                        )}

                        {item.quantity <= 1 && (
                          <ion-text>{formatCurrency(item.price)}</ion-text>
                        )}
                      </p>
                    </ion-label>

                    {item.date && (
                      <ion-note
                        color="medium"
                        slot="end"
                        onClick={(event) => presentModal(event, item)}
                      >
                        {new Date(item.date).toLocaleDateString()}
                      </ion-note>
                    )}
                  </ion-item>

                  <ion-item-options side="start">
                    <ion-item-option
                      onClick={() => handleDeleteItem(item.id)}
                      color="danger"
                    >
                      <ion-icon slot="icon-only" name="trash-outline" />
                    </ion-item-option>
                  </ion-item-options>
                </ion-item-sliding>
              ))}
            </ion-list>
          )}

          {!isReady && (
            <ion-list class="my-list my-list--inner">
              <ion-item>
                <ion-label>
                  <ion-skeleton-text animated style={{ width: "80%" }} />
                </ion-label>
              </ion-item>
              <ion-item>
                <ion-label>
                  <ion-skeleton-text animated style={{ width: "50%" }} />
                </ion-label>
              </ion-item>
              <ion-item>
                <ion-label>
                  <ion-skeleton-text animated style={{ width: "60%" }} />
                </ion-label>
              </ion-item>
              <ion-item>
                <ion-label>
                  <ion-skeleton-text animated style={{ width: "70%" }} />
                </ion-label>
              </ion-item>
            </ion-list>
          )}
        </section>
      </ion-content>

      <ion-modal
        id="modal"
        is-open={modal.isOpen}
        onWillDismiss={() => dismiss()}
      >
        <ion-header class="ion-no-border" translucent>
          <ion-toolbar>
            <ion-buttons slot="end">
              <ion-button onClick={() => dismiss()}>
                <ion-icon
                  color="medium"
                  name="close-outline"
                  slot="icon-only"
                />
              </ion-button>
            </ion-buttons>

            <ion-title>{modal.componentProps?.headerTitle}</ion-title>
          </ion-toolbar>
        </ion-header>

        <ion-content fullscreen>
          <form name="formItem">
            <ion-list class="ion-no-padding">
              <ion-item>
                <ion-label position="fixed">Nome</ion-label>
                <ion-input
                  name="name"
                  value={modal.componentProps?.name}
                  onInput={changeFormItem}
                  autoCapitalize="words"
                />
              </ion-item>

              <ion-item>
                <ion-label position="fixed">Preço</ion-label>
                <ion-input
                  type="text"
                  name="price"
                  value={modal.componentProps?.price}
                  onInput={changeFormItem}
                  inputMode="decimal"
                />
              </ion-item>

              <ion-item>
                <ion-label position="fixed">Quantidade</ion-label>
                <ion-input
                  type="number"
                  min="1"
                  name="quantity"
                  value={modal.componentProps?.quantity}
                  onInput={changeFormItem}
                />
              </ion-item>

              <ion-item>
                <ion-label position="fixed">Data</ion-label>
                <ion-input
                  type="date"
                  name="date"
                  value={modal.componentProps?.date}
                  onInput={changeFormItem}
                />
                {/* <ion-datetime
                  name="date"
                  cancelText="Fechar"
                  doneText="Ok"
                  min="1990-02"
                  display-format="DD/MM/YYYY"
                  month-short-names="jan, fev, mar, abr, mai, jun, jul, ago, set, out, nov, dez"
                  value={modal.componentProps?.date}
                  onInput={changeFormItem}
                /> */}
              </ion-item>
            </ion-list>
          </form>
        </ion-content>
        <ion-footer>
          <div className="ion-padding">
            <ion-button expand="full" onClick={() => submit()}>
              Salvar
            </ion-button>
          </div>
        </ion-footer>
      </ion-modal>
    </>
  );
}
