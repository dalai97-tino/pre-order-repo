import { AdminShell } from "@/components/admin-shell";
import { Icon } from "@/components/icon";
import { PageHeader } from "@/components/page-header";

export default function SettingsPage() {
  return (
    <AdminShell>
      <PageHeader
        eyebrow="Систем"
        title="Тохиргоо"
        description="Дэлгүүрийн ерөнхий мэдээлэл, төлбөр, хүргэлтийн нөхцөл."
        actions={
        <div className="topActions">
          <button className="secondaryButton">Цуцлах</button>
          <button className="primaryButton">Хадгалах</button>
        </div>
        }
      />

      <section className="grid cols12">
        <article className="card span8">
          <div className="sectionHeader">
            <h2>Дэлгүүрийн мэдээлэл</h2>
          </div>
          <div className="formGrid">
            <div className="field">
              <label>Дэлгүүрийн нэр</label>
              <input defaultValue="Zaya Shop Mongolia" />
            </div>
            <div className="field">
              <label>Утас</label>
              <input defaultValue="+976 9911 0022" />
            </div>
            <div className="field">
              <label>Имэйл</label>
              <input defaultValue="orders@zayashop.mn" />
            </div>
            <div className="field">
              <label>Валют</label>
              <select defaultValue="MNT">
                <option value="MNT">MNT - Монгол төгрөг</option>
                <option value="CNY">CNY - Юань</option>
              </select>
            </div>
            <div className="field" style={{ gridColumn: "1 / -1" }}>
              <label>Хаяг</label>
              <textarea defaultValue="Улаанбаатар хот, Баянзүрх дүүрэг, 26-р хороо" />
            </div>
          </div>
        </article>

        <aside className="grid span4">
          <article className="card totalBox">
            <h2>Төлбөрийн нөхцөл</h2>
            <div className="field">
              <label>Хүргэлтийн төлбөр</label>
              <input defaultValue="5000" />
            </div>
            <div className="field">
              <label>Урьдчилгаа хувь</label>
              <input defaultValue="30" />
            </div>
          </article>
          <article className="card totalBox">
            <h2>Банкны данс</h2>
            <div className="totalRow"><span>Банк</span><strong>Хаан банк</strong></div>
            <div className="totalRow"><span>Данс</span><strong>5000 1234 56</strong></div>
            <div className="totalRow"><span>Эзэмшигч</span><strong>Zaya Shop</strong></div>
            <button className="secondaryButton">
              <Icon name="add_card" />
              Данс нэмэх
            </button>
          </article>
        </aside>
      </section>
    </AdminShell>
  );
}
