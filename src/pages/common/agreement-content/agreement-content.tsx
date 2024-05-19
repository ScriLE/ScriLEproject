import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {commonAPI} from "../../../api";

export const AgreementContent = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const response = await commonAPI.getAgreementContent(Number(id));
      const linkElement = document.createElement('a');
      // linkElement.href = `data:${response.headers['content-type']};base64,` + response.data;
      const data = btoa(unescape(encodeURIComponent(response.data)));
      linkElement.href = `data:application/pdf;base64,` + data;
      linkElement.download = /filename="(.*)"/.exec(response.headers['content-disposition'] || '')?.[1] || 'unnamed,pdf';
      document.body.appendChild(linkElement);
      linkElement.click();  // IE: "Access is denied"; see: https://connect.microsoft.com/IE/feedback/details/797361/ie-10-treats-blob-url-as-cross-origin-and-denies-access
      document.body.removeChild(linkElement);
      setLoading(false);
    })();
  }, [id]);

  if(loading) return <>Загрузка...</>;

  return null;
}