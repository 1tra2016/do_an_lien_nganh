package do_an_lien_nganh.laptop.sales.website.mapper;

import do_an_lien_nganh.laptop.sales.website.dto.laptop.LaptopRequest;
import do_an_lien_nganh.laptop.sales.website.dto.laptop.LaptopResponseDetail;
import do_an_lien_nganh.laptop.sales.website.dto.laptop.LaptopResponseShort;
import do_an_lien_nganh.laptop.sales.website.entity.Laptop;

public class LaptopMapper {

    public static Laptop toEntity(LaptopRequest request) {
        Laptop laptop = new Laptop();

        laptop.setName(request.getName());
        laptop.setPrice(request.getPrice());
        laptop.setRemain(request.getRemain());

        laptop.setBrand(request.getBrand());

        laptop.setCpu(request.getCpu());
        laptop.setRam(request.getRam());
        laptop.setDrive(request.getDrive());
        laptop.setCard(request.getCard());
        laptop.setScreen(request.getScreen());
        laptop.setCamera(request.getCamera());

        laptop.setPort(request.getPort());

        laptop.setWeight(request.getWeight());
        laptop.setPin(request.getPin());
        laptop.setSystem(request.getSystem());

        laptop.setImages(request.getImages());

        return laptop;
    }

    public static void updateEntity(Laptop laptop, LaptopRequest request) {

        if (request.getName() != null) laptop.setName(request.getName());
        if (request.getPrice() != null) laptop.setPrice(request.getPrice());
        if (request.getRemain() != null) laptop.setRemain(request.getRemain());
        if (request.getBrand() != null) laptop.setBrand(request.getBrand());

        if (request.getCpu() != null) laptop.setCpu(request.getCpu());
        if (request.getRam() != null) laptop.setRam(request.getRam());
        if (request.getDrive() != null) laptop.setDrive(request.getDrive());
        if (request.getCard() != null) laptop.setCard(request.getCard());

        if (request.getScreen() != null) laptop.setScreen(request.getScreen());
        if (request.getCamera() != null) laptop.setCamera(request.getCamera());
        if (request.getPort() != null) laptop.setPort(request.getPort());

        if (request.getWeight() != null) laptop.setWeight(request.getWeight());
        if (request.getPin() != null) laptop.setPin(request.getPin());
        if (request.getSystem() != null) laptop.setSystem(request.getSystem());

        if (request.getImages() != null) laptop.setImages(request.getImages());
    }

    public static LaptopResponseShort toLaptopResponseShort(Laptop laptop){
        LaptopResponseShort laptopResponseShort = new LaptopResponseShort();

        laptopResponseShort.setName(laptop.getName());
        laptopResponseShort.setId(laptop.getId());
        laptopResponseShort.setPrice(laptop.getPrice());
        laptopResponseShort.setRemain(laptop.getRemain());
        laptopResponseShort.setBrand(laptop.getBrand());
        laptopResponseShort.setImageMain(laptop.getImages().get(0));

        return  laptopResponseShort;
    }

    public static LaptopResponseDetail toLaptopResponseDetail(Laptop laptop) {
        LaptopResponseDetail requestDetail = new LaptopResponseDetail();

        requestDetail.setId(laptop.getId());
        requestDetail.setName(laptop.getName());
        requestDetail.setPrice(laptop.getPrice());
        requestDetail.setRemain(laptop.getRemain());

        requestDetail.setBrand(laptop.getBrand());

        requestDetail.setCpu(laptop.getCpu());
        requestDetail.setRam(laptop.getRam());
        requestDetail.setDrive(laptop.getDrive());
        requestDetail.setCard(laptop.getCard());
        requestDetail.setScreen(laptop.getScreen());
        requestDetail.setCamera(laptop.getCamera());

        requestDetail.setPort(laptop.getPort());

        requestDetail.setWeight(laptop.getWeight());
        requestDetail.setPin(laptop.getPin());
        requestDetail.setSystem(laptop.getSystem());

        requestDetail.setImages(laptop.getImages());

        return requestDetail;
    }
}