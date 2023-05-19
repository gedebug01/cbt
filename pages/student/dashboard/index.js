import { Grid, Image } from 'antd';
import style from './styles.module.scss';

const { useBreakpoint } = Grid;

export default function Admin() {
  const { md } = useBreakpoint();
  return (
    <div className={style.wrapper}>
      <Image
        alt="logo"
        src="https://elearning.mipesrikdi.sch.id/__statics/upload/logo1656311603.png"
        width={100}
      />
      <div className={style.container}>
        <p className={md ? style.title : style.titleSm}>Selamat datang di</p>
        <p className={md ? style.cbt : style.cbtSm}>Computer Based Test</p>
        <p className={md ? style.mipesri : style.mipesriSm}>MI Pesri Kendari</p>
      </div>
    </div>
  );
}
