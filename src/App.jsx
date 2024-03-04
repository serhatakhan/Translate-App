import { useEffect, useMemo, useState } from "react";
import { getLanguages, translateText } from "./redux/actions/translateActions";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import Loader from "./components/Loader";
import { updateText } from "./redux/slices/translateSlice";

const App = () => {
  //seçilen dilleri ve çevrilecek metni state'de tut. hem seçilen dili hem de hedef dili hemde çevrilecek metni
  const [sourceLang, setSourceLang] = useState({
    "value": "tr",
    "label": "Turkish"
  });
  const [targetLang, setTargetLang] = useState({
    "value": "en",
    "label": "English"
  });
  const [text, setText] = useState();


  const dispatch = useDispatch();
  const langState = useSelector((store) => store.language);
  const translateState = useSelector((store) => store.translate);

  useEffect(() => {
    dispatch(getLanguages());
  }, []);


  // diziyi kütüphanenin istedği formata çevir (value ve label değerleri içeren nesne istiyor.)
  // api'den gelen nesnelerin içindeki code ve name değerlerini, value ve label'a çevireceğiz
  // ELİMİZDE BİR DİZİ VARSA VE ONU FORMATLAYIP YENİ BİR DİZİ ELDE ETMEK İSTİYORSAK map() !! // her bir i için bir nesne döndürdük !
  // Diziyi formatlama işleminin her render sırasında olmasını istemediğimz için,
  // useMemo kullanarak cache'e gönderdik.
  const formatted = useMemo(
    () =>
      langState.languages.map((i) => ({
        value: i.code,
        label: i.name,
      })),
    [langState.languages]
  );
  /** useMemo boş diziyi(cevaplar gelmeden önce boş dizi çünkü) alıp onu mapliyor. map fonksiyonunu çalıştırdıktan sonra yine boş dizi üretmiş oldu. bu ürettiği boş diziyi hafızaya atıyor. yeni veri gelipte tekrar render olduğunda o yüzden içi boş görünüyordu selectlerin. 
  burda yapılması gereken: bileşende tuttuğumuz langState.languages değeri her değiştiğinde tekrardan hesaplamanı yap dememiz lazım. o yüzden langState.languages'i, useMemo'nun bağımlılık dizisine ekledik. **/

  

  // değiştirme fonksiyonu
  const handleChange = ()=>{
    // select alanlarındaki değerleri değiştir
    setSourceLang(targetLang)
    setTargetLang(sourceLang)

    // text alanlarındaki değerleri değiştir
    setText(translateState.text)
    // 2.text alanını slice'ta tutuyoruz. slicetaki text değerini güncelle
    //(payload olarak (text) yolladık. bu nerden geldi. ilk textarea'nın value'si. bunun için verdik zaten)
    dispatch(updateText(text))
  }


  return (
    <div className="bg-slate-900 h-screen text-white grid place-items-center">
      <div className="w-[80vw] max-w-[1100px] flex flex-col justify-center">
        <h1 className="text-center text-4xl font-semibold mb-7">
          Translate <span className="text-teal-300">{"<>"}</span>
        </h1>

        {/* üst alan */}
        <div className="flex gap-2 text-black">
          <Select
            onChange={setSourceLang}
            isLoading={langState.isLoading}
            isDisabled={langState.isLoading}
            value={sourceLang}
            options={formatted}
            className="flex-1 rounded"
          />

          <button onClick={handleChange} className=" rounded py-[6px] px-6 bg-zinc-700 text-white transition hover:ring-2 hover:bg-zinc-800">
            Değiştir
          </button>

          <Select
            onChange={setTargetLang}
            isLoading={langState.isLoading}
            isDisabled={langState.isLoading}
            value={targetLang}
            options={formatted}
            className="flex-1 rounded"
          />
        </div>

        {/* text alanları */}
        <div className="flex mt-4 gap-[115px] max-md:flex-col max-md:gap-3">
          <div className="flex-1">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full min-h-[270px] max-h-[500px] p-[10px] text-[20px] rounded text-black"
            />
          </div>

          <div className="flex-1 relative">
            <textarea
              value={translateState.text}
              disabled
              className="w-full min-h-[270px] max-h-[500px] p-[10px] text-[20px] rounded"
            />
            {translateState.isLoading && <Loader />}
          </div>
        </div>

        {/* button */}
        <button onClick={()=> dispatch(translateText({sourceLang, targetLang, text}))} className="rounded py-3 px-5 text-[18px] font-semibold cursor-pointer  bg-zinc-700 text-white transition hover:ring-2 hover:bg-zinc-800 mt-3">
          Çevir
        </button>
      </div>
    </div>
  );
};

/* {langState?.languages?.map((i)=> (
      <option>{i.name}</option>
))} bu yolla yapılırsa kullanıcı filtrelemeyi düzgün yapamaz.tr yi aramak için "t" ye basar ama sonra tüm t'lere bakması gerekir. */

export default App;
