import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { languageOptions } from "../../constants";

// asenkron thunk aksiyonları
export const getLanguages = createAsyncThunk(
  "language/getLanguages",
  async () => {
    // EĞER Kİ İSTEK ATACAĞIMIZ OPTIONS'IN İÇİNDE METOT TANIMLANMIŞSA (method: "GET" gibi), axios.get() yazarak ekstra olarak metodu tanımlamamıza gerek kalmıyor.
    const res = await axios.request(languageOptions);

    // mutlaka return satırına sahip olmalı !!
    return res.data.data.languages;
  }
);

// api'ın çeviri uç noktasına istek at
export const translateText = createAsyncThunk( "translate/translateText",
  async (action_params) => {
    // 'çevir' butonuna tıklanınca gelen aksiyon paramtrelerini buradaki parametre ile alıp bir alt satırda dağıttık
    // yani aksiyonu dispatch ederken gönderilen parametrelere erişme
    const {sourceLang, targetLang, text} = action_params

    // gönderilecek parametreleri belirle (api parametreleri böyle belirlemiş)
    const params = new URLSearchParams();
    params.set("source_language", sourceLang.value);
    params.set("target_language", targetLang.value);
    params.set("text", text);

    // axios istek ayarlarını belirle
    const options = {
      method: "POST",
      url: "https://text-translator2.p.rapidapi.com/translate",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "X-RapidAPI-Key": "2d33ced34dmshe921208dae0eedap10a7f8jsn7a8e9f31b93b",
        "X-RapidAPI-Host": "text-translator2.p.rapidapi.com",
      },
      data: params,
    };

    // isteği at
    const res = await axios.request(options)

    return res.data.data.translatedText
  }
);
