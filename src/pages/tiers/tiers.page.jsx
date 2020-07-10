import React from 'react'
import $ from 'utils/selector'
import Swal from 'sweetalert2'
import './tiers.styles.scss'

class Tiers extends React.Component {
    state = {
        isEdit: false,
        editTier: {},
        insertTier: {},
        tiers: []
    }
    getAllTiers = () => {
        const {linkApi} = this.props;
        fetch(linkApi+'tiers')
            .then(response => response.json())
            .then(data => data.sort((a,b) => a.id - b.id))
            .then(data => this.setState({tiers: data}));
    }
    onChangeInput = (type, field, event) => {
        let val = event.target.value;
        if(field === 'probability' || field === 'disc_percentage'){
            val = val.replace(/\D/gm, '');
            val = parseInt(val) / 100;
            this.setState({[type]: {...this.state[type], [field]: val}});
        }else{
            val = parseInt(val);
            this.setState({[type]: {...this.state[type], [field]: val}});
        }
    }
    onEnterToInsertTier = (event) => {
        if(event.key === 'Enter'){
            this.onInsertTier()
        }
    }
    onInsertTier = () => {
        const {linkApi} = this.props;
        const {tiers, insertTier} = this.state;
        fetch(linkApi+'tiers/create', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                id: tiers.length+1,
                ...insertTier
            })
        })
        .then(response => response.json())
        .then(data => {
            Swal.fire({
                title: 'Oops...',
                text: data[0].message,
                icon: 'error',
                confirmButtonText: 'OK'
              });
            if(!data[0].message.match(/gagal/gmi)){
                Swal.fire({
                    title: 'Success!',
                    text: data[0].message,
                    icon: 'success',
                    confirmButtonText: 'OK'
                  });
                // reset form insert
                $('#min_trx').value = '';
                $('#max_trx').value = '';
                $('#disc_percentage').value = '';
                $('#probability').value = '';
            }
        })
        .then(_ => this.getAllTiers())
        .catch(err => Swal.fire('Gagal mengakses server'));

    }
    onEditTier = (id) => {
        const {linkApi} = this.props;
        fetch(linkApi+'tiers/'+id)
        .then(response => response.json())
        .then(tier => this.setState({isEdit: true, idEdit: id, editTier: tier}))
        .then(_ => $('#edit-min_trx').focus())
        .catch(err => Swal.fire('Gagal mengakses server'));
    }
    onSubmitEditTier = () => {
        const {linkApi} = this.props;
        fetch(linkApi+'tiers/update', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(this.state.editTier)
        })
        .then(response => response.json())
        .then(data => {
            if(data[0].message.match(/gagal/gmi)){
                Swal.fire({
                    title: 'Oops...',
                    text: data[0].message,
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }else{
                this.getAllTiers();
                this.setState({isEdit: false, idEdit: null});
            }
        })
        .catch(err => Swal.fire('Gagal mengakses server untuk diedit'))
    }
    onEnterToSubmitEditTier = (event) => {
        if(event.key === 'Enter'){
            this.onSubmitEditTier()
        }
    }
    deleteTier = (id) => {
        const {linkApi} = this.props;
        Swal.fire({
            title: `Yakin mau dihapus ?`,
            text: `Tingkatan ${id} tidak akan bisa dikembalikan setelah dihapus.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yap, hapus aja!',
            cancelButtonText: 'Batalkan'
        }).then(result => {
            if(result.value){
                fetch(linkApi+'tiers/delete', {
                    method: 'delete',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        id: id
                    })
                })
                .then(_ => this.getAllTiers())
                .catch(err => Swal.fire('Gagal mengakses server'));
            }
        })
    }
    componentWillMount() {
        this.getAllTiers();
    }
    render(){
        const {tiers} = this.state;
        return (
            <div className="container">
                <div className="form-transaction">
                    <h1>Membuat Tingkatan</h1>
                    <div className="input-field">
                        <input 
                            type="number" 
                            name="min_trx" 
                            id="min_trx" 
                            onChange={(event) => this.onChangeInput('insertTier', 'min_trx', event)}
                        />
                        <label htmlFor="min_trx">Jumlah Minimum</label>
                    </div>
                    <div className="input-field">
                        <input 
                            type="number" 
                            name="max_trx" 
                            id="max_trx" 
                            onChange={(event) => this.onChangeInput('insertTier', 'max_trx', event)} 
                        />
                        <label htmlFor="max_trx">Jumlah Maksimum</label>
                    </div>
                    <div className="input-field">
                        <input 
                            type="text" 
                            name="disc_percentage" 
                            id="disc_percentage" 
                            onChange={(event) => this.onChangeInput('insertTier', 'disc_percentage', event)} 
                        />
                        <label htmlFor="disc_percentage">Diskon ( ##% )</label>
                    </div>
                    <div className="input-field">
                        <input 
                            type="text" 
                            name="probability" 
                            id="probability" 
                            onChange={(event) => this.onChangeInput('insertTier', 'probability', event)}
                            onKeyDown={this.onEnterToInsertTier} 
                        />
                        <label htmlFor="probability">Probabilitas ( ##% )</label>
                    </div>
                    <button onClick={this.onInsertTier} className="btn waves-effect waves-light blue">Buat</button>
                </div>
                <div className="tiers-table">
                    <h3>Tabel Tingkatan</h3>
                    <div className="tiers-table__row title">
                        <div className="id">
                            Tingkatan
                        </div>
                        <div className="min-trx">
                            Min-trx
                        </div>
                        <div className="max-trx">
                            Max-trx
                        </div>
                        <div className="disc_percentage">
                            Diskon ( % )
                        </div>
                        <div className="probability">
                            Probabilitas ( % )
                        </div>
                        <div className="action">
                            Aksi
                        </div>
                    </div>
                    {
                        (tiers.length < 1) ? <p className="center">Tabel kosong...</p> : null
                    }
                    {
                        tiers.map(tier => {
                            
                            const { isEdit, idEdit } = this.state;
                            const isValid = isEdit && tier.id === idEdit;
                            const minTrxFormatted =  parseInt(tier['min_trx']).toLocaleString().replace(',', '.');
                            const maxTrxFormatted =  parseInt(tier['max_trx']).toLocaleString().replace(',', '.');
                            const probabilityFormatted = tier.probability*100;
                            const discountFormatted = tier['disc_percentage']*100;

                            return (
                            <div key={tier.id} data-id={tier.id} className="tiers-table__row">
                                <div className="id">
                                    Tingkat {tier.id}
                                </div>
                                <div className="min_trx">
                                    {
                                        (!isValid)
                                        ? `Rp ${minTrxFormatted}`
                                        : <input 
                                            id="edit-min_trx"
                                            type="number"
                                            placeholder="Rp" 
                                            defaultValue={tier['min_trx']}
                                            onChange={(event) => this.onChangeInput('editTier', 'min_trx', event)} 
                                            onKeyDown={this.onEnterToSubmitEditTier}
                                          />
                                    }
                                </div>
                                <div className="max_trx">
                                    {
                                        (!isValid)
                                        ? `Rp ${maxTrxFormatted}`
                                        : <input 
                                            type="number"
                                            placeholder="Rp" 
                                            defaultValue={tier['max_trx']}
                                            onChange={(event) => this.onChangeInput('editTier', 'max_trx', event)} 
                                            onKeyDown={this.onEnterToSubmitEditTier}
                                          />
                                    }
                                </div>
                                <div className="disc_percentage">
                                    {
                                        (!isValid)
                                        ? `${discountFormatted}%`
                                        : <input 
                                            type="number"
                                            placeholder="%" 
                                            defaultValue={discountFormatted}
                                            onChange={(event) => this.onChangeInput('editTier', 'disc_percentage', event)}
                                            onKeyDown={this.onEnterToSubmitEditTier} 
                                        />
                                    }
                                </div>
                                <div className="probability">
                                    {
                                        (!isValid)
                                        ? `${probabilityFormatted}%`
                                        : <input 
                                            type="number"
                                            placeholder="%" 
                                            defaultValue={probabilityFormatted}
                                            onChange={(event) => this.onChangeInput('editTier', 'probability', event)} 
                                            onKeyDown={this.onEnterToSubmitEditTier}
                                        />
                                    }
                                    
                                </div>
                                <div className="action">
                                    <button 
                                        onClick={()=> 
                                            (!isValid) 
                                            ? this.onEditTier(tier.id) 
                                            : this.onSubmitEditTier()
                                        }
                                        className="btn waves-effect waves-light yellow darken-1">
                                            <i className="material-icons">edit</i>
                                    </button>
                                    <button 
                                        onClick={()=>this.deleteTier(tier.id)}
                                        disabled={(!isValid) ? false : true} 
                                        className="btn waves-effect waves-light red darken-1">
                                            <i className="material-icons">delete</i>
                                    </button>
                                </div>
                            </div>
                        )})
                    }
                </div>
            </div>
        )
    }
}

export default Tiers;