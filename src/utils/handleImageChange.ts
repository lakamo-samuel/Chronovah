//  export const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//        const file = e.target.files?.[0];
//        if (!file) return;

//        const reader = new FileReader();
//        reader.onload = () => {
//          if (typeof reader.result === "string") {
//            setProfileImg(reader.result);
//          }
//        };
//        reader.readAsDataURL(file);
//      };