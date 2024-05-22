import { useLists } from "contexts/lists";
import { IList } from "core/list.model";
import { useRouter } from "next/router";
import { presentAlertPrompt } from "services/ionic";
import { addList, updateList } from "services/lists";
import { formatCurrency } from "utils/formatNumber";

export default function Home() {
  const router = useRouter();
  const { lists } = useLists();
  const ionList = document.querySelector("#list") as HTMLIonListElement;

  const handlePrompt = async (list: IList = null) => {
    const handleSubmit = async (data: any) => {
      if (!data.name) return;
      if (!!list) await updateList({ ...list, name: data.name });
      else await addList(data);
    };
    await presentAlertPrompt(list, handleSubmit);
    ionList?.closeSlidingItems?.();
  };

  return (
    <>
      <ion-header translucent>
        <ion-toolbar>
          <ion-title class="home__title" color="dark">
            <strong>mybudgets</strong>
          </ion-title>

          {/* <ion-buttons slot="end">
            <Link href="/user">
              <ion-button>
                <ion-icon
                  color="medium"
                  name="person-outline"
                  slot="icon-only"
                />
              </ion-button>
            </Link>
          </ion-buttons> */}
        </ion-toolbar>
      </ion-header>

      <ion-content class="home__content" fullscreen>
        <ion-fab vertical="bottom" horizontal="end" slot="fixed">
          <ion-fab-button onClick={() => handlePrompt()}>
            <ion-icon name="add-outline" />
          </ion-fab-button>
        </ion-fab>

        <section className="my-wrapper-list">
          {!!lists?.length && (
            <ion-list id="list" class="my-list my-list--root" lines="none">
              {lists.map((list: any) => (
                <ion-item-sliding key={list.id}>
                  <ion-item
                    button
                    onClick={() => router.push(`/list/${list.id}`)}
                    detail
                  >
                    <ion-avatar slot="start">
                      <ion-icon color="primary" name="reader-outline" />
                    </ion-avatar>

                    <ion-label class="my-list__item__label ion-text-wrap">
                      <ion-text color="">{list.name}</ion-text>

                      <p>
                        {!!list.total && (
                          <>
                            <ion-text color="">
                              {formatCurrency(list.total)}
                            </ion-text>
                            <ion-text color="medium">&nbsp;&nbsp;</ion-text>
                          </>
                        )}

                        <ion-text color="medium">
                          {!list.itemsLength || list.itemsLength === 0 ? (
                            "Nenhum item"
                          ) : list.itemsLength === 1 ? (
                            <>({list.itemsLength} item)</>
                          ) : (
                            <>({list.itemsLength} itens)</>
                          )}
                        </ion-text>
                      </p>
                    </ion-label>
                  </ion-item>

                  <ion-item-options side="end">
                    <ion-item-option
                      onClick={() => {
                        handlePrompt(list);
                      }}
                      color="medium"
                    >
                      <ion-icon slot="icon-only" name="create" color="light" />
                    </ion-item-option>
                  </ion-item-options>
                </ion-item-sliding>
              ))}
            </ion-list>
          )}

          {/* Skeleton */}
          {!lists && (
            <ion-list class="my-list my-list--root" lines="none">
              <ion-item>
                <ion-avatar slot="start">
                  <ion-skeleton-text animated />
                </ion-avatar>
                <ion-label>
                  <ion-skeleton-text animated style={{ width: "40%" }} />
                  <p>
                    <ion-skeleton-text animated style={{ width: "20%" }} />
                  </p>
                </ion-label>
              </ion-item>
              <ion-item>
                <ion-avatar slot="start">
                  <ion-skeleton-text animated />
                </ion-avatar>
                <ion-label>
                  <ion-skeleton-text animated style={{ width: "80%" }} />
                  <p>
                    <ion-skeleton-text animated style={{ width: "20%" }} />
                  </p>
                </ion-label>
              </ion-item>
              <ion-item>
                <ion-avatar slot="start">
                  <ion-skeleton-text animated />
                </ion-avatar>
                <ion-label>
                  <ion-skeleton-text animated style={{ width: "50%" }} />
                  <p>
                    <ion-skeleton-text animated style={{ width: "20%" }} />
                  </p>
                </ion-label>
              </ion-item>
              <ion-item>
                <ion-avatar slot="start">
                  <ion-skeleton-text animated />
                </ion-avatar>
                <ion-label>
                  <ion-skeleton-text animated style={{ width: "60%" }} />
                  <p>
                    <ion-skeleton-text animated style={{ width: "20%" }} />
                  </p>
                </ion-label>
              </ion-item>
            </ion-list>
          )}
        </section>
      </ion-content>
    </>
  );
}
