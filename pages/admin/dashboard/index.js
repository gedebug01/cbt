import { Image } from 'antd';
import style from './styles.module.scss';

export default function Admin() {
  return (
    <div className={style.wrapper}>
      <Image
        alt="logo"
        src="https://elearning.mipesrikdi.sch.id/__statics/upload/logo1656311603.png"
        width={100}
      />
      <div className={style.container}>
        <p className={style.title}>Selamat datang di</p>
        <p className={style.cbt}>Computer Based Test</p>
        <p className={style.mipesri}>MI Pesri Kendari</p>
      </div>
    </div>
  );
}
