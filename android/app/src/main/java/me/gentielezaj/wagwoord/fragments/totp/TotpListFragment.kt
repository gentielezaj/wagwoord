package me.gentielezaj.wagwoord.fragments.totp

import androidx.fragment.app.activityViewModels
import me.gentielezaj.wagwoord.fragments.BaseFragmentList
import me.gentielezaj.wagwoord.fragments.util.BaseRecyclerViewAdapter
import me.gentielezaj.wagwoord.models.entities.Totp
import me.gentielezaj.wagwoord.services.entity.CoreEntityService
import me.gentielezaj.wagwoord.services.dependencyInjection.injectEntityService
class TotpListFragment : BaseFragmentList<Totp, TotpViewHolder>() {

    override val entityService: CoreEntityService<Totp> by injectEntityService<Totp>()
    override val viewModel: TotpViewModel by activityViewModels()

    override fun adapter(): BaseRecyclerViewAdapter<Totp, TotpViewHolder> = TotpRecyclerViewAdapter(dataSet)

    companion object {
         fun newInstance() = TotpListFragment()
    }
}
