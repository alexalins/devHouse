import House from '../models/House';
import User from '../models/User';
import * as Yup from 'yup';

class HouseController {

    async index(req, res) {
        const { status } = req.query;
        const houses = await House.find({ status });
        return res.json(houses);
    }

    async store(req, res) {
        const schema = Yup.object().shape({
            description: Yup.string().required(),
            price: Yup.number().required(),
            location: Yup.string().required(),
            status: Yup.boolean().required(),
        });

        const { filename } = req.file ? req.file : '';
        const { description, price, location, status } = req.body;
        const { user_id } = req.headers;

        if(! (await schema.isValid(req.body))) {
            return res.status(400).json({error: 'Falha na validação.'});
        }

        await House.create({
            user: user_id,
            thumbnail: filename,
            description,
            price,
            location,
            status
        });

        return res.json({status: 200});
    }

    async update(req, res) {
        const schema = Yup.object().shape({
            description: Yup.string().required(),
            price: Yup.number().required(),
            location: Yup.string().required(),
            status: Yup.boolean().required(),
        });

        const { house_id } = req.params;
        const { description, price, location, status } = req.body;
        const { user_id } = req.headers;
        const { filename } = req.file ? req.file : '';

        const user =  User.findById(user_id);
        const houses =  House.findById(house_id)

        if(! (await schema.isValid(req.body))) {
            return res.status(400).json({error: 'Falha na validação.'});
        }

        if(String(user._id) !== String(houses.user)) {
            return res.status(401).json({error: 'Não autorizado.'})
        }

        House.updateOne({ _id: house_id }, {
            user: user_id,
            thumbnail: filename,
            description,
            price,
            location,
            status
        });

        return res.json({status: 200});
    }

    async destroy(req, res) {
        const { house_id } = req.body;
        const { user_id } = req.headers;

        const user = await User.findById(user_id);
        const houses = await House.findById(house_id);

        if(String(user._id) !== String(houses.user)) {
            return res.status(401).json({error: 'Não autorizado.'})
        }

        await House.findByIdAndDelete({ _id: house_id});

        return res.json({ok: true});
    }
}

export default new HouseController();